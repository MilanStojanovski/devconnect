import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import Moment from 'react-moment';
import { Link } from 'react-router-dom';

import { deleteEducation } from '../../actions/profileActions';

class Education extends Component {
    onDeleteClick = id => {
        this.props.deleteEducation(id);
    };

    render() {
        const education = this.props.education.map(edu => (
            <tr key={edu._id}>
                <td>{edu.school}</td>
                <td>{edu.degree}</td>
                <td>{edu.field}</td>
                <td>
                    <Moment format="YYYY/MM/DD">{edu.from}</Moment> - {edu.to === null ? ('Now') : <Moment format="YYYY/MM/DD">{edu.to}</Moment>}
                </td>
                <td><button onClick={this.onDeleteClick} className="btn btn-danger">Delete</button></td>
            </tr>
        ));

        return (
            <div>
                <h4 className="mb-4">
                    Education Credentials
                    <Link style={{float: 'right'}} to="/add-education" className="btn btn-light">
                        <i className="fas fa-graduation-cap text-info mr-1" />
                        Add Education
                    </Link>
                </h4>
                <table className="table">
                    <thead>
                    <tr>
                        <th>School</th>
                        <th>Degree</th>
                        <th>Field</th>
                        <th>Years</th>
                    </tr>
                    </thead>
                    <tbody>
                    {education}
                    </tbody>
                </table>
            </div>
        );
    }
}

Education.propTypes = {
    deleteEducation: PropTypes.func.isRequired
};

export default connect(null, { deleteEducation })(Education);
