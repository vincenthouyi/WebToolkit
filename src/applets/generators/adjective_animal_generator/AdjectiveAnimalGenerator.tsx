import {Container, Row, Form, Col, Table} from "react-bootstrap";
import React from "react";
import animalFile from "../../../../public/animals.json";
import adjectiveFile from "../../../../public/adjectives.json";

function capitalizeInitial(s?: string): string {
    return s ? s[0].toLocaleUpperCase() + s.slice(1) : ""
}

function randomlyChoose<T>(l: T[]): T | undefined {
    if (l.length == 0) {
        return undefined
    }
    return l[Math.floor(Math.random() * l.length)]
}

function spaceFormatter(words: string[]): string {
    return words.map(capitalizeInitial).join(' ')
}

function pascalCaseFormatter(words: string[]): string {
    return words.map(capitalizeInitial).join('')
}

function camelCaseFormatter(words: string[]): string {
    if (words.length == 0) {
        return ""
    }

    return words.slice(1).reduce((acc, word) => {
        return acc + capitalizeInitial(word)
    }, words[0].toLowerCase())
}

function underscoreFormatter(words: string[]): string {
    return words.map(word => word.toLowerCase()).join('_')
}

function kebabFormatter(words: string[]): string {
    return words.map(word => word.toLowerCase()).join('-')
}

function chunkResults<T>(list: T[], chunkSize: number): T[][] {
    const result: T[][] = []

    return list.reduce((acc, elem, index) => {
        const rowNum = Math.floor(index / chunkSize)
        if (acc.length == rowNum) {
            const empty: T[] = []
            acc.push(empty)
        }
        acc[rowNum].push(elem)
        return acc
    }, result)
}

const animals = (animalFile as Animal[])
const adjectives = (adjectiveFile as string[])

function getRandomAnimal(initial: string, animalWithEmoji: boolean): Animal | undefined {
    const filteredAnimals = animals
        .filter(animal => animal.name.toLowerCase().startsWith(initial.toLowerCase()))
        .filter(animal => animalWithEmoji ? animal.emoji : true)
    return randomlyChoose(filteredAnimals)
}

function getRandomAdjective(initial: string): string | undefined {
    const filteredAdj = adjectives.filter(adj =>
        adj.toLowerCase().startsWith(initial.toLowerCase())
    )
    return randomlyChoose(filteredAdj)
}

export type Animal = {
    name: string,
    emoji?: string,
}

enum NameFormatStyle {
    Space = "Space",
    PascalCase = "PascalCase",
    CamelCase = "camelCase",
    Underscore = "Underscore",
    Kebab = "Kebab",
}

// export const formatterMap: {[name: string]: (words: string[]) => string} = {
const formatterMap = new Map<string, (words: string[]) => string>([
    [NameFormatStyle.Space, spaceFormatter],
    [NameFormatStyle.PascalCase, pascalCaseFormatter],
    [NameFormatStyle.CamelCase, camelCaseFormatter],
    [NameFormatStyle.Underscore, underscoreFormatter],
    [NameFormatStyle.Kebab, kebabFormatter],
])

const MAX_NUM_GENERATION = 30
const MAX_NUM_ADJECTIVES = 3
const DEFAULT_NUM_GENERATION = 10
const DEFAULT_NUM_ADJECTIVES = 1
const DEFAULT_INIT_LETTER = ''
const DEFAULT_ANIMAL_WITH_EMOJI = false
const DEFAULT_FORMATTER: string = NameFormatStyle.Space

const initialList = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    .split('')
    .map(letter => {
        return {letter: letter, label: letter}
    })
    .concat({letter: DEFAULT_INIT_LETTER, label: 'Any'})
    .map(l => <option value={l.letter} key={`initialLetter-${l.letter}`}>{l.label}</option>)

const numGenerationList = Array
    .from(Array(MAX_NUM_GENERATION + 1).keys())
    .map(num => (
        <option value={num} key={`numGen-${num}`}>{num}</option>
    ))

const numAdjectivesList = Array
    .from(Array(MAX_NUM_ADJECTIVES + 1).keys())
    .map(num => (
        <option value={num} key={`numAdj-${num}`}>{num}</option>
    ))

const formatterList = [...formatterMap.keys()]
    .map(style => <option value={style} key={`formatter-${style}`}>{style}</option>)

export function AdjectiveAnimalGenerator() {
    const [initial, setInitial] = React.useState(DEFAULT_INIT_LETTER);
    const [numAdjectives, setNumAdjectives] = React.useState(DEFAULT_NUM_ADJECTIVES)
    const [numGenerate, setNumGenerate] = React.useState(DEFAULT_NUM_GENERATION)
    const [animalWithEmoji, setAnimalWithEmoji] = React.useState(DEFAULT_ANIMAL_WITH_EMOJI)
    const [formatter, setFormatter] = React.useState(DEFAULT_FORMATTER)

    const generatedNames = Array.from(Array(numGenerate)).map(() => {
        const adjectives = Array.from(Array(numAdjectives)).map(() => getRandomAdjective(initial) ?? "")
        const animal = getRandomAnimal(initial, animalWithEmoji)
        const nameFormatter = formatterMap.get(formatter)!
        return nameFormatter(adjectives.concat(animal?.name ?? "")) + animal?.emoji
    })

    const chunkedNames = chunkResults(generatedNames, 4)
        .map((chunk, rowIdx) =>
            <tr key={`result-row-${rowIdx}`}>
                {chunk.map((name, colIdx) => (
                    <td key={`result-${rowIdx}-${colIdx}`}>{name}</td>
                ))}
            </tr>
        )

    return (
        <Container>
            <Row>
                <h1 className="text-center">
                    Adjective Animal Name Generator
                </h1>
            </Row>
            <Form as={Row}>
                <Row>
                    <Form.Group as={Col}>
                        <Row>
                            <Form.Label column>Number of Generates</Form.Label>
                            <Col>
                                <Form.Select
                                    aria-label="Number of Generates"
                                    defaultValue={numGenerate}
                                    onChange={e => setNumGenerate(parseInt(e.target.value))}
                                >
                                    {numGenerationList}
                                </Form.Select>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Row>
                            <Form.Label column>Number of Adjectives</Form.Label>
                            <Col>
                                <Form.Select
                                    aria-label="Number of Adjectives"
                                    defaultValue={numAdjectives}
                                    onChange={e => setNumAdjectives(parseInt(e.target.value))}
                                >
                                    {numAdjectivesList}
                                </Form.Select>
                            </Col>
                        </Row>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col}>
                        <Row>
                            <Form.Label column>Initial Letter</Form.Label>
                            <Col>
                                <Form.Select
                                    aria-label="Initial Letter"
                                    defaultValue={initial}
                                    onChange={e => setInitial(e.target.value)}
                                    key='initial_letter'
                                >
                                    {initialList}
                                </Form.Select>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Row>
                            <Form.Label column>Name Style</Form.Label>
                            <Col>
                                <Form.Select
                                    aria-label="Name Style"
                                    defaultValue={formatter}
                                    onChange={e => {
                                        if (formatterMap.has(e.target.value)) {
                                            setFormatter(e.target.value)
                                        }
                                    }}
                                >
                                    {formatterList}
                                </Form.Select>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Switch
                            label="Animal with emoji"
                            type='checkbox'
                            id='animal_with_emoji'
                            defaultChecked={animalWithEmoji}
                            onChange={e => setAnimalWithEmoji(e.target.checked)}
                        />
                    </Form.Group>
                </Row>
            </Form>
            <Row>
                <Table striped bordered>
                    <tbody>
                    {chunkedNames}
                    </tbody>
                </Table>
            </Row>
        </Container>
    )
}
