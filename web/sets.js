'use strict';

import ReactDOM from 'react-dom';
import React, {Component} from 'react';

import {connect} from 'react-redux';
import {fetchAction} from './actions';

import {PLACES, PLACEHOLDERS, LOGO} from './const';


class Set extends Component{

    constructor(props) {
        super(props);

        this.state = {loading: true};
    }

    onHover(hover) {
        let {data, fetching, setDetails} = this.props;

        !fetching && data && setDetails(hover ? data : {});
    }

    onLoad() {
        console.log(arguments);
    }

    render() {
        let {data, place, fetching} = this.props;
        let video = <i><pre>{PLACEHOLDERS[place]}</pre></i>;

        if (data) {
            video = <iframe src={`https://youtube.com/embed/${data.id}?showinfo=0&autoplay=${place === 'first'}`}
                            className={fetching && place !== 'first' ? 'obsolete' : ''}
                            onLoad={this.onLoad} frameBorder="0" allowFullScreen />;
        };

        return <div className={`set ${place}`}>
                   <div onMouseEnter={this.onHover.bind(this, true)}
                        onMouseLeave={this.onHover.bind(this, false)}
                        className={`video ${fetching ? '' : 'loaded'}`}>
                        {video}
                   </div>
               </div>;
    }
};


class Details extends Component {

    render() {
        let {fetch, fetching, details, transition} = this.props;

        let element = <img className={fetching ? 'rotating' : ''}
                           onClick={fetch.bind(this)} src={LOGO} />;

        if (details.artist || this.props.transition) {
            element = <div className="details">
                           <h1>{details.artist}</h1>
                           <i>{details.location}</i>
                      </div>;
        };

        return <div className="details-area">{element}</div>;
    }
};


class Container extends Component {
    constructor(props) {
        super(props);

        this.state = {
            details: {},
            transition: false
        };
    }

    setDetails(details) {
        this.setState({
            details: details,
            transition: true
        });

        setTimeout(() => {
            this.setState({transition: false});
        }, 200);
    }

    componentDidMount() {
        this.props.fetch();
    }

    render() {
        let {details, transition} = this.state;
        let {sets, fetch, fetching} = this.props;

        let items = PLACES.map(
            place => <Set key={place} place={place}
                          data={sets[place]} fetching={fetching[place]}
                          setDetails={this.setDetails.bind(this)} />);

        return <div>
                   <div className="sets">{items}</div>
                   <Details {...{fetch, details, transition}}
                            fetching={Object.values(fetching).includes(true)}/>
               </div>;
    }
};


const props = state => {
    return {
        sets: state.sets,
        fetching: state.fetching
    };
};


const actions = dispatch => {
    return {
        fetch: place => dispatch(fetchAction(place))
    };
};


export default connect(props, actions)(Container);
