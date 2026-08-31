import BenchmarkBundle from 'models/BenchmarkBundle.js';

export function getParameterValues(benchmarkBundles) {
    const valuesByName = {};
    benchmarkBundles.forEach(bundle => bundle.benchmarkMethods.forEach(method => {
        (method.params || []).forEach(([name, value]) => {
            if (!valuesByName[name]) {
                valuesByName[name] = new Set();
            }
            valuesByName[name].add(String(value));
        });
    }));

    return Object.keys(valuesByName).sort().reduce((result, name) => {
        result[name] = Array.from(valuesByName[name]).sort(compareParameterValues);
        return result;
    }, {});
}

export function filterBenchmarkBundles(benchmarkBundles, parameterFilters) {
    return benchmarkBundles.map(bundle => {
        const benchmarkMethods = bundle.benchmarkMethods.filter(method => methodMatches(method, parameterFilters));
        if (benchmarkMethods.length == 0) {
            return null;
        }

        return new BenchmarkBundle({
            key: bundle.key,
            name: bundle.name,
            benchmarkMethods: benchmarkMethods,
            methodNames: Array.from(new Set(benchmarkMethods.map(method => method.name)))
        });
    }).filter(bundle => bundle);
}

function methodMatches(method, parameterFilters) {
    return (method.params || []).every(([name, value]) => {
        const selectedValues = parameterFilters[name];
        return !selectedValues || selectedValues.indexOf(String(value)) >= 0;
    });
}

function compareParameterValues(left, right) {
    const leftNumber = Number(left);
    const rightNumber = Number(right);
    if (!isNaN(leftNumber) && !isNaN(rightNumber)) {
        return leftNumber - rightNumber;
    }
    return left.localeCompare(right);
}
