import typeOf from 'just-typeof';

type ArgumentType = string | Object | Array<Object> | Array<string> | null;
type PropNameMap = { [prop: string]: string };
type PropNameMaps = Array<PropNameMap>;
type PropNamePair = [ string, string ];
type PropNamePairs = Array<PropNamePair>;

const convertMap = function (propMaps): PropNamePairs {
    if (propMaps.some(map => {
        if (typeof map === 'undefined' || typeOf(map) === 'null') {
            return true;
        } else {
            return false;
        }
    })) {
        return [ ];
    }
    return propMaps.flatMap( (map: Object) => Object.entries(map) );
};

export const parseProps = function parseProps (propNames: Array<ArgumentType>): Array<PropNamePairs> {
    if (propNames.every((propName) => typeof propName === 'string' || typeof propName === 'symbol')) {
        const propNameMaps: PropNameMaps = (<Array<string>>propNames).map(propName => ({[propName]: propName}));
        return [ convertMap(propNameMaps), convertMap(propNameMaps) ];
    }  else if (Array.isArray(propNames) && propNames.length === 1 && Array.isArray(propNames[0])) {
        if ((<Array<any>>propNames[0]).every((propName) => typeof propName === 'string')) {
            const propNameMaps: PropNameMaps = (<Array<string>>propNames[0]).map(propName => ({[propName]: propName}));
            return [ convertMap(propNameMaps) , [] ];
        } else {
            return parseProps(<Array<ArgumentType>>propNames[0]);
        }
    } else if (propNames.length <= 2 && propNames.every((propName) => Array.isArray(propName) || typeOf(propName) === 'null' || typeof propName === 'undefined')) {
        const readableProps = <Array<PropNameMap>>propNames[0] || [];
        const writeableProps = <Array<PropNameMap>>propNames[1] || [];

        const readablePropsMap: PropNameMaps = readableProps.map( prop => {
            if (typeof prop === 'string' || typeof prop === 'symbol') {
                return <PropNameMap>{[prop]: prop};
            } else if (typeof prop === 'object') {
                return <PropNameMap>prop;
            }
        });

        const writeablePropsMap: PropNameMaps = writeableProps.map( prop => {
            if (typeof prop === 'string' || typeof prop === 'symbol') {
                return <PropNameMap>{[prop]: prop};
            } else if (typeof prop === 'object') {
                return <PropNameMap>prop;
            }
        });

        return [ convertMap(<PropNameMap[]>readablePropsMap), convertMap(<PropNameMap[]>writeablePropsMap) ];
    } else if (propNames.every(propName => typeof propName === 'object')) {
        const propNamePairs = convertMap(propNames);
        return [ propNamePairs, propNamePairs ];
    } else {
        throw Error(`Failed to parse props. Rejected arguments of types ${propNames.map(propName => typeof propName)}`);
    }
}

export default parseProps;
