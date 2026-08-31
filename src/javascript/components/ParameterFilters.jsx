import React from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/lib/Button'

import { actions } from 'store/store.js'
import { getParameterValues } from 'functions/parameterFilters.js'

export default class ParameterFilters extends React.Component {

    static propTypes = {
        benchmarkBundles: PropTypes.array.isRequired,
        parameterFilters: PropTypes.object.isRequired,
    };

    selectValue(name, value, availableValues, selected) {
        const selectedValues = this.selectedValues(name, availableValues);
        if (!selected && selectedValues.length == 1) {
            return;
        }

        const nextValues = selected ?
            selectedValues.concat(value) :
            selectedValues.filter(selectedValue => selectedValue !== value);
        actions.setParameterFilter(name, nextValues);
    }

    selectedValues(name, availableValues) {
        return this.props.parameterFilters[name] || availableValues;
    }

    render() {
        const parameterValues = getParameterValues(this.props.benchmarkBundles);
        const parameterNames = Object.keys(parameterValues);
        if (parameterNames.length == 0) {
            return null;
        }

        return <div className="parameter-filters">
            <div className="parameter-filters-header">
                <strong>Parameter filters</strong>
                <Button bsSize="xsmall" onClick={ () => actions.resetParameterFilters() }>Reset all</Button>
            </div>
            { parameterNames.map(name => {
                const availableValues = parameterValues[name];
                const selectedValues = this.selectedValues(name, availableValues);
                return <div className="parameter-filter" key={ name }>
                    <div className="parameter-filter-name">
                        <b>{ name }</b>
                        <span>{ `${selectedValues.length}/${availableValues.length}` }</span>
                    </div>
                    <div className="parameter-filter-values">
                        { availableValues.map(value => {
                            const checked = selectedValues.indexOf(value) >= 0;
                            return <label key={ value }>
                                <input
                                    type="checkbox"
                                    checked={ checked }
                                    disabled={ checked && selectedValues.length == 1 }
                                    onChange={ event => this.selectValue(name, value, availableValues, event.target.checked) }
                                />
                                { ` ${value}` }
                            </label>;
                        }) }
                    </div>
                </div>;
            }) }
        </div>;
    }
}
