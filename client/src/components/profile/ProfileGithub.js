import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class ProfileGithub extends Component {
    state = {
        clientId: 'd46b99735fead6a2bb8c',
        clientSecret: '0ee94ace28918fd4fb02eaaa453c8ecc273e0c75',
        count: 5,
        sort: 'created: asc',
        repos: []
    };

    componentDidMount() {
        const { username } = this.props;
        const { count, sort, clientId, clientSecret } = this.state;

        fetch(`http://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`)
            .then(res => res.json())
            .then(data => {
                if (this.refs.myRef) {
                    this.setState({repos: data});
                }
            })
            .catch(err => console.log(err));
    }

    render() {
        const { repos } = this.state;

        const repoItems = repos.map(repo => (
            <div key={repo.id} className="card card-body mb-2">
                <div className="row">
                    <div className="col-md-6">
                        <h4>
                            <a href={repo.html_url} className="text-info" target="_blank">{repo.name}</a>
                        </h4>
                        <p>{repo.description}</p>
                    </div>
                    <div className="col-md-6">
                        <span className="badge badge-info mr-1">Stars: {repo.stargasers_count}</span>
                        <span className="badge badge-secondary mr-1">Watchers: {repo.watchers_count}</span>
                        <span className="badge badge-success">Forks: {repo.forks_count}</span>
                    </div>
                </div>
            </div>
        ));
        return (
            <div ref="myRef">
                <hr />
                <h3 className="mb-4">Latest Github Repos</h3>
                {repoItems}
            </div>
        );
    }
}

ProfileGithub.propTypes = {
    username: PropTypes.string.isRequired
};

export default ProfileGithub;
