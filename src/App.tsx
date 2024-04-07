import NavBar from 'react-bootstrap/Navbar';
import { Container, Nav, Row, NavDropdown } from 'react-bootstrap';
import {
    Routes,
    Route,
} from "react-router-dom";

function Home() {
    return <p>Hello</p>
}

function NavigationBar(props: {
    appletGroups: AppletGroup[],
}) {
    const appletGroupsNav = props
        .appletGroups
        .map(appletGroup => {
            const appletNav = appletGroup
                .applets
                .map(applet => (
                        <NavDropdown.Item
                            href={'#' + applet.path}
                            key={applet.path}
                        >
                            {applet.title}
                        </NavDropdown.Item>
                    )
                )

            return (
                <NavDropdown
                    title={appletGroup.title}
                    id="basic-nav-dropdown"
                    key={appletGroup.title}
                >
                    {appletNav}
                </NavDropdown>
            )
        }
    )

    return (
        <NavBar>
            <Container>
                <NavBar.Brand href="#">Web Toolkit</NavBar.Brand>
                <NavBar.Toggle aria-controls="basic-navbar-nav" />
                <NavBar.Collapse id="basic-navbar-nav">
                    <Nav>
                        {appletGroupsNav}
                    </Nav>
                </NavBar.Collapse>
            </Container>
        </NavBar>
    )
}

function App() {
    const appletGroups = [
        GeneratorApplets()
    ]

    const appletRoutes = appletGroups
        .flatMap(appletGroup => appletGroup.applets)
        .map(applet => (
            <Route
                path={applet.path}
                element={applet.component}
                key={applet.path} />
        ))

    const routes = [
        <Route
            path={'/'}
            element={<Home/>}
            key={'/'} />
    ].concat(appletRoutes)

    return (
        <Container>
            <Row>
                <NavigationBar
                    appletGroups={appletGroups}
                />
            </Row>
            <Row>
                <Routes> {routes} </Routes>
            </Row>
        </Container>
    );
}

export default App;

import 'bootstrap/dist/css/bootstrap.min.css';
import {GeneratorApplets} from "./applets/generators/GeneratorApplets.tsx";
import {AppletGroup} from "./applets/applet.ts";