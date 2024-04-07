export type Applet = {
    title: string,
    component: JSX.Element,
    path: string,
}

export type AppletGroup = {
    title: string,
    applets: Applet[],
}