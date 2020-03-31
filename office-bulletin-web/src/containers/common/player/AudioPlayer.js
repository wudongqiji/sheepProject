import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";
import { Icon } from 'antd';

import './player.css';

import {
	mediaPlay
} from '../../../modules/media';

class AudioPlayer extends Component {
	onClose() {
		this.props.mediaPlay(null);
	}

	render() {
		const options = {
			audioLists: this.props.play,
			mode: "full",
			theme: "dark",
			autoPlay: true,
			toggleMode: false,
			showDownload: false,
			seeked: true,
		}

		if (this.props.play) {
			return (
				<div>
					<a className="closeAudio" onClick={()=>this.onClose()}><Icon type="close-circle" /></a>
					<ReactJkMusicPlayer {...options} />
				</div>
			);
		}
		return null;
	}
}

const mapStateToProps = state => ({
	router: state.router,
//	play: state.media.play
});

const mapDispatchToProps = dispatch =>
bindActionCreators(
	{
		mediaPlay
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);