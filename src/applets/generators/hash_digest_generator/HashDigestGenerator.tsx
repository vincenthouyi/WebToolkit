import React from "react";
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import CryptoJS, {MD5, SHA1, SHA256, SHA384, SHA512} from 'crypto-js';

type WordArray = CryptoJS.lib.WordArray;

enum InputType {
    Text = "Text",
    Base64Binary = "Base64Binary",
    HexBinary = "HexBinary",
    File = "File",
}

enum OutputAlgorithm {
    MD5 = "MD5",
    SHA1 = "SHA1",
    SHA256 = "SHA256",
    SHA384 = "SHA384",
    SHA512 = "SHA512",
}

const HashMap = new Map<OutputAlgorithm, (input: WordArray) => string>([
    [OutputAlgorithm.MD5, input => MD5(input).toString()],
    [OutputAlgorithm.SHA1, input => SHA1(input).toString()],
    [OutputAlgorithm.SHA256, input => SHA256(input).toString()],
    [OutputAlgorithm.SHA384, input => SHA384(input).toString()],
    [OutputAlgorithm.SHA512, input => SHA512(input).toString()],
])

const InputConverterMap = new Map<InputType, (input: string) => WordArray>([
    [InputType.Text, input => CryptoJS.enc.Utf8.parse(input)],
    [InputType.Base64Binary, input => CryptoJS.enc.Base64.parse(input)],
    [InputType.HexBinary, input => CryptoJS.enc.Hex.parse(input)],
    [InputType.File, input => CryptoJS.enc.Base64.parse(input)],
])

const inputTypeList = [...InputConverterMap.keys()]
    .map(type => (
        <option value={type} key={`inputType-${type}`}>{type}</option>
    ))

export function HashDigestGenerator() {
    const [input, setInput] = React.useState("")
    const [inputType, setInputType] = React.useState(InputType.Text)

    const outputList = [...HashMap.entries()]
        .map(([algo, hashFunc]) => {
            const inputConverter = InputConverterMap.get(inputType)!
            const wordArray = inputConverter(input)
            const hash = hashFunc(wordArray)
            return (
                <tr
                    key={`result-${algo}`}
                >
                    <td>{algo}</td>
                    <td>
                        <Row>
                            <Col>{hash}</Col>
                            <Col>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="float-end"
                                    onClick={() => {navigator.clipboard.writeText(hash).finally()}}
                                >
                                    Copy
                                </Button>
                            </Col>
                        </Row>
                    </td>
                </tr>
            )
        })

    const inputFrame = () => {
        if (inputType == InputType.File) {
            return (
                <Row>
                    <label htmlFor="formFile" className="form-label">File upload</label>
                    <input className="form-control" type="file" id="formFile"
                           onChange={e => {
                               if (e.target.files == null || e.target.files.length == 0) {
                                   return
                               }
                               const file = e.target.files![0]
                               const reader = new FileReader()
                               reader.readAsArrayBuffer(file)
                               reader.onload = () => {
                                   if (reader.result == null) {
                                       return
                                   }
                                   setInput(CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.create(reader.result as ArrayBuffer)))
                               }
                           }}
                    ></input>
                </Row>
            )
        } else {
            return (
                <Row>
                    <Form.Control
                        as="textarea"
                        rows={10}
                        onChange={e=> setInput(e.target.value)}
                    />
                </Row>
            )
        }
    }

    return (
        <Container>
            <Row>
                <h1 className="text-center">
                    Hash Digest Generator
                </h1>
            </Row>
            <Form as={Row}>
                <Form.Group>
                    <Row>
                        <Form.Label column>Input Type</Form.Label>
                        <Col>
                            <Form.Select
                                aria-label="Input Type"
                                defaultValue={inputType}
                                onChange={e => setInputType(e.target.value as InputType)}
                            >
                                {inputTypeList}
                            </Form.Select>
                        </Col>
                    </Row>
                    {inputFrame()}
                </Form.Group>
            </Form>
            <Row>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Algorithm</th>
                            <th>Hash</th>
                        </tr>
                    </thead>
                    <tbody>
                        {outputList}
                    </tbody>
                </Table>
            </Row>
        </Container>
    )
}
