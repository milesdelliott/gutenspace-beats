import React from 'react';
const Tone = require("Tone");

let Instrument = ( props ) => {
	const steps = props.steps;
	return (
		<tr>
			{[...Array(steps)].map((e, i) => <Step toggleNote={props.toggleNote} key={e} step={i} sequence={props.sequence} instrumentData={props.instrumentData} />)}
		</tr>
	);
};

class Step extends React.Component {
	constructor(props) {
		super(props);
		this.changeNote = this.changeNote.bind(this)
	}

	changeNote() {
		this.props.toggleNote(this.props.instrumentData, this.props.step);
	}

	render() {
		return <td><label className="block-check"><input className="sequencer__input block-check__input" type="checkbox" onChange={this.changeNote} /><span className="block-check__mark" /></label></td>;
	}
};

let Beats = (props) => {
	return (
		<form>
			{props.instruments.map((e) => <Instrument sequence={props.sequence} toggleNote={props.toggleNote} steps={props.steps} instrumentData={e} />)}
		</form>
	);
}

class Oscillator extends React.Component {
	constructor(props) {
		super(props);

		this.env = this.props.envelope;
		this.waves = ['sine','square','triangle','sawtooth'];

		this.tone = new Tone.Oscillator({
			frequency: this.props.frequency,
			type: this.waves[this.props.waveform],
			volume: this.props.volume
		}).connect(this.env).start();

	}
	componentWillReceiveProps(newProps) {
		this.tone.detune.value = newProps.detune;
		this.tone.volume.value = newProps.volume;
		this.tone.type = this.waves[newProps.waveform];
		if (newProps.playing ) {
			this.tone.frequency.value = newProps.playing;
		}
	}
	render() {
		let ret;
		return (<div className="oscillator">
			<br/>
			{ this.props.children }
		</div>);
	}
}

class Sequencer extends React.Component {

	constructor(props) {
		super(props);
		this.envelope = {};
		this.envelope.A3 = new Tone.AmplitudeEnvelope({
			attack : 0.41,
			decay : 0.21,
			sustain : 0.9,
			release : .9
		}).toMaster()
		this.envelope.C3 = new Tone.AmplitudeEnvelope({
			attack : 0.41,
			decay : 0.21,
			sustain : 0.9,
			release : .9
		}).toMaster()
		this.envelope.F3 = new Tone.AmplitudeEnvelope({
			attack : 0.41,
			decay : 0.21,
			sustain : 0.2,
			release : .1
		}).toMaster()
		this.state = {
			frequencies: {
				0: 440
			},
			detunes: {
				0: -30
			},
			volumes: {
				0: 0
			},
			waveforms: {
				0: 1
			},
			steps: this.props.steps,
			instruments: ['A2', 'B2', 'C2', 'D2'],
			sequence: []
		};
		this.setDetune = this.setDetune.bind(this);
		this.setVol = this.setVol.bind(this);
		this.setWav = this.setWav.bind(this);
		this.startNote = this.startNote.bind(this);
		this.stopNote = this.stopNote.bind(this);
		this.toggleNote = this.toggleNote.bind(this);
		this.doStep = this.doStep.bind(this);
		this.getSequence = this.getSequence.bind(this);
		let getSequence = this.getSequence;
		let doStep = this.doStep;

		let loop = new Tone.Sequence(function(time, col){
			doStep({notes: getSequence()[col]});
		}, [...Array(this.props.steps).keys()], "16n");

		loop.start();
		loop.loop = true;
		Tone.Transport.start();
		Tone.Transport.setLoopPoints(0, '2m');
		Tone.Transport.loop = true;

		this.synth = new Tone.PolySynth(6).toMaster();


		/*
		let sequencer = ( step, sequence ) => {
			for ( every step ) {
				for (   every instrument) {
					if (is on) {
						playNote()
					}
				}
			}
		}*/


	}
	componentDidMount() {
		let newState = this.state;
		for (let i = newState.steps; i > 0; i--) {
			newState.sequence.push(newState.instruments.reduce(
				(a, v) => {
					a[v] = false;
					return a;
				}
				, {})
			)
		}
		this.setState(newState)

	}
	doStep(stepData) {
		this.state.instruments.map((e, i) => {
			let vel = Math.random() * 0.5 + 0.5;
			stepData.notes[e] && this.synth.triggerAttackRelease(e, 0.01, undefined, vel);
		});
	}

	getSequence() {
		return this.state.sequence;
	}

	setDetune(osc, v) {
		let detunes = this.state.detunes;
		detunes[osc] = v;
		this.setState({
			detunes: detunes
		});
	}
	setVol(osc, v) {
		let volumes = this.state.volumes;
		volumes[osc] = v;
		this.setState({
			volumes: volumes
		});
	}
	setWav(osc, v) {
		let waveforms = this.state.waveforms;
		waveforms[osc] = v;
		console.log(v);
		this.setState({
			waveforms: waveforms
		});
	}
	startNote(note) {
		let newState = this.state;
		newState[note] = note;
		this.setState(newState);

		this.envelope[note].triggerAttack();
	}
	stopNote(note) {
		console.log("stop");
		let newState = this.state;
		newState[note] = false;
		this.setState(newState);
		this.envelope[note].triggerRelease();
	}

	toggleNote(note, step) {
		let newState = this.state;
		//console.log(note)
		//console.log(newState.sequence)
		//this.startNote('A1');
		newState[note] = false;
		newState.sequence[step][note] = !newState.sequence[step][note];
		this.setState(newState);
		//this.envelope[note].triggerAttackRelease();
	}

	render() {
		return <div>
			<Oscillator frequency={440}
						detune={ this.state.detunes[0] }
						waveform={ this.state.waveforms[0] }
						volume={ this.state.volumes[0] }
						type={ 'square' }
						envelope={this.envelope.A3}
						playing={this.state.A3}>
			</Oscillator>
			<Oscillator frequency={240}
						detune={ this.state.detunes[0] }
						waveform={ this.state.waveforms[0] }
						volume={ this.state.volumes[0] }
						type={ 'square' }
						envelope={this.envelope.C3}
						playing={this.state.C3}>
			</Oscillator>
			<Oscillator frequency={940}
						detune={ this.state.detunes[0] }
						waveform={ this.state.waveforms[0] }
						volume={ this.state.volumes[0] }
						type={ 'square' }
						envelope={this.envelope.F3}
						playing={this.state.F3}>
			</Oscillator>
			<Beats instruments={this.state.instruments} sequence={this.state.sequence} toggleNote={this.toggleNote} steps={this.props.steps} />
		</div>;
	}
}

export default Sequencer;
