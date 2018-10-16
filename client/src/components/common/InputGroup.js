import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const InputGroup = props => {
    const {
        name,
        placeholder,
        value,
        error,
        type,
        onChange,
        icon
    } = props;
    return (
        <div className="input-group mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text"><i className={icon} /></span>
            </div>
            <input
                type={type}
                className={classnames('form-control form-control-lg', {
                    'is-invalid': error
                })}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
};

InputGroup.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    icon: PropTypes.string,
    error: PropTypes.string,
    onChange: PropTypes.func.isRequired
};

InputGroup.defaultProps = {
    type: 'text'
};

export default InputGroup;
