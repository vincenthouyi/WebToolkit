import {Applet, AppletGroup} from '../applet.ts';
import {AdjectiveAnimalGenerator} from "./adjective_animal_generator/AdjectiveAnimalGenerator.tsx";

export function GeneratorApplets() : AppletGroup {
    const pathPrefix = 'generator/'

    const adjAnimalGen : Applet = {
        title: 'Adjective Animal Generator',
        component: AdjectiveAnimalGenerator(),
        path: pathPrefix + 'adjAnimalGen'
    };

    return {
        title: 'Generators',
        applets: [adjAnimalGen],
    }
}