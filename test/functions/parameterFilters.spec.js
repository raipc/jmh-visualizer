import { expect } from 'chai';

import { filterBenchmarkBundles, getParameterValues } from '../../src/javascript/functions/parameterFilters.js'
import BenchmarkBundle from '../../src/javascript/models/BenchmarkBundle.js'
import BenchmarkMethod from '../../src/javascript/models/BenchmarkMethod.js'

describe('functions: parameterFilters', () => {

    const bundle = new BenchmarkBundle({
        key: 'com.Benchmark',
        name: 'Benchmark',
        methodNames: ['withAtlas', 'withoutAtlas'],
        benchmarkMethods: [
            method('withAtlas', [['buildMode', 'UNIFIED'], ['metrics', '100']]),
            method('withAtlas', [['buildMode', 'SPLIT'], ['metrics', '100']]),
            method('withAtlas', [['buildMode', 'UNIFIED'], ['metrics', '10000']]),
            method('withoutAtlas', [['metrics', '100']])
        ]
    });

    it('collects and sorts parameter values', () => {
        expect(getParameterValues([bundle])).to.deep.equal({
            buildMode: ['SPLIT', 'UNIFIED'],
            metrics: ['100', '10000']
        });
    });

    it('filters selected values and keeps methods without that parameter', () => {
        const [filtered] = filterBenchmarkBundles([bundle], {
            buildMode: ['SPLIT'],
            metrics: ['100']
        });

        expect(filtered.benchmarkMethods.map(benchmarkMethod => benchmarkMethod.key)).to.deep.equal([
            'withAtlas [buildMode=SPLIT:metrics=100]',
            'withoutAtlas [metrics=100]'
        ]);
        expect(filtered.methodNames).to.deep.equal(['withAtlas', 'withoutAtlas']);
    });

    it('leaves bundles unchanged without filters', () => {
        const [filtered] = filterBenchmarkBundles([bundle], {});
        expect(filtered.benchmarkMethods).to.deep.equal(bundle.benchmarkMethods);
    });
});

function method(name, params) {
    return new BenchmarkMethod({
        name: name,
        params: params,
        benchmarks: [{}]
    });
}
