import {Container, Row, Form, Col} from "react-bootstrap";
import React from "react";
import {adjectives, animals} from "./vocabulary.ts";

function capitalizeInitial(s?: string) : string {
    return s? s[0].toLocaleUpperCase() + s.slice(1) : ""
}

function randomlyChoose<T>(l: T[]): T | null {
    if (l.length == 0) {
        return null
    }
    return l[Math.floor(Math.random() * l.length)]
}

function chunkResults<T>(list: T[], chunkSize: number) : T[][] {
    const result : T[][] = []

    return list.reduce((acc, elem, index) => {
        const rowNum = Math.floor(index/chunkSize)
        if (acc.length == rowNum) {
            const empty: T[] = []
            acc.push(empty)
        }
        acc[rowNum].push(elem)
        return acc
    }, result)
}

function getRandomAnimal(initial: string, animalWithEmoji: boolean): Animal | null {
    const filteredAnimals = animals
        .filter(animal => animal.name.toLowerCase().startsWith(initial.toLowerCase()))
        .filter(animal => animalWithEmoji ? animal.emoji : true)
    return randomlyChoose(filteredAnimals)
}

function getRandomAdjective(initial: string): string | null {
    const filteredAdj = adjectives.filter(adj =>
        adj.toLowerCase().startsWith(initial.toLowerCase())
    )
    return randomlyChoose(filteredAdj)
}

export type Animal = {
    name: string,
    emoji?: string,
}

const SEPARATOR = " "
const MAX_NUM_GENERATION = 30
const DEFAULT_NUM_GENERATION = 10
const DEFAULT_INIT_LETTER = ''
const DEFAULT_ANIMAL_WITH_EMOJI = false

const initialList = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    .split('')
    .map(letter => { return {letter: letter, label: letter} })
    .concat( {letter: DEFAULT_INIT_LETTER, label: 'Any'} )
    .map(l => <option value={l.letter} key={`initialLetter-${l.letter}`}>{l.label}</option>)

const numGenerationList = Array
    .from(Array(MAX_NUM_GENERATION + 1).keys())
    .map(num => (
        <option value={num} key={`numGen-${num}`}>{num}</option>
    ))

export function AdjectiveAnimalGenerator() {
    const [initial, setInitial] = React.useState(DEFAULT_INIT_LETTER);
    const [numGenerate, setNumGenerate] = React.useState(DEFAULT_NUM_GENERATION)
    const [animalWithEmoji, setAnimalWithEmoji] = React.useState(DEFAULT_ANIMAL_WITH_EMOJI)

    const generatedNames = Array.from(Array(numGenerate)).map(() => {
        const animal = getRandomAnimal(initial, animalWithEmoji)
        const adjective = getRandomAdjective(initial) ?? ""
        return capitalizeInitial(adjective) + SEPARATOR + capitalizeInitial(animal?.name) + animal?.emoji
    })

    const chunkedNames = chunkResults(generatedNames, 4)
        .map((chunk , rowIdx)=>
            <Row key={`result-row-${rowIdx}`}>
                {chunk.map((name , colIdx) => (<Col key={`result-${rowIdx}-${colIdx}`}>{name}</Col>))}
            </Row>
        )

    return (
        <Container>
            <Row>
                <h1 className="text-center">
                    Adjective Animal Name Generator
                </h1>
            </Row>
            <Form as={Row}>
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
                    <Form.Switch
                        label="Animal with emoji"
                        type='checkbox'
                        id='animal_with_emoji'
                        defaultChecked={animalWithEmoji}
                        onChange={e => setAnimalWithEmoji(e.target.checked)}
                    />
                </Form.Group>
            </Form>
            <Row>
                {chunkedNames}
            </Row>
        </Container>
    )
}
