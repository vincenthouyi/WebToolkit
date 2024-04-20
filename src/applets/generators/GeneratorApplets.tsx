import {Applet, AppletGroup} from '../applet.ts';
import {AdjectiveAnimalGenerator} from "./adjective_animal_generator/AdjectiveAnimalGenerator.tsx";
import {HashDigestGenerator} from "./hash_digest_generator/HashDigestGenerator.tsx";

export function GeneratorApplets() : AppletGroup {
    const pathPrefix = 'generator/'

    const adjAnimalGen : Applet = {
        title: 'Adjective Animal Generator',
        component: AdjectiveAnimalGenerator(),
        path: pathPrefix + 'adjAnimalGen'
    };

    const hashDigestGenerator: Applet = {
        title: 'Hash Digest Generator',
        component: HashDigestGenerator(),
        path: pathPrefix + 'hashDigestGen'
    };


    return {
        title: 'Generators',
        applets: [
            adjAnimalGen,
            hashDigestGenerator,
        ],
    }
}