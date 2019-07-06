import React from 'react';

import { Select }  from "@material-ui/core";
import PropTypes from "prop-types";

const DropdownAI = ({ options, onClick }) => {
    return (
        <Select
            native
            inputProps={{
                id: 'ai-algorithm',
            }}
            onChange={onClick}
        >
            {options.map(option => (
                <option key={option.value} {...option}>
                    {option.text}
                </option>
            ))}
        </Select>
    );
};

const { array, func } = PropTypes;
DropdownAI.propTypes = {
    options: array.isRequired,
    onClick: func.isRequired,
};

export default DropdownAI;
