import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';

// Main CSS: ui-components/dropdownmenu.less

export default class DropdownMenu extends React.Component {
	constructor(props) {
		super(props);

		this.menuButtonClick = this.menuButtonClick.bind(this);
		this.closeMenu = this.closeMenu.bind(this);

		this.state = {
			menuOpen: false
		};
	}

	menuButtonClick() {
		this.setState({
			menuOpen: !this.state.menuOpen
		}, function() {
			if (this.state.menuOpen && this.props.onOpen) {
				this.props.onOpen();
			}
		}.bind(this));
	}

	closeMenu() {
		this.setState({
			menuOpen: false
		});
	}

	windowClickHandler(event) {
		var componentEl = ReactDOM.findDOMNode(this.refs.container);

		if (!!componentEl && !componentEl.contains(event.target)) {
			this.closeMenu();
		}
	}

	componentDidMount() {
		if (!this.props.manuallyClose) {
			document.getElementById('app').addEventListener('click', this.windowClickHandler.bind(this));
		}
	}

	UNSAFE_componentWillReceiveProps(props) {
	}

	render() {
		var dropdownStyle = {};

		if (this.props.dropdownHeight) {
			dropdownStyle['height'] = this.props.dropdownHeight.indexOf('px') == -1 ? this.props.dropdownHeight+'px' : this.props.dropdownHeight;
			dropdownStyle['maxHeight'] = this.props.dropdownHeight.indexOf('px') == -1 ? this.props.dropdownHeight+'px' : this.props.dropdownHeight;
		}

		if (this.props.dropdownWidth) {
			dropdownStyle['width'] = this.props.dropdownWidth.indexOf('px') == -1 ? this.props.dropdownWidth+'px' : this.props.dropdownWidth;
		}

		return (
			<div ref="container" className={'dropdown-wrapper'+(this.props.dropdownDirection ? ' dropdown-direction-'+this.props.dropdownDirection : '')}>

				<a tabIndex={0} className={'dropdown-link'+(this.props.className ? ' '+this.props.className : '')} onClick={this.menuButtonClick}>{this.props.label || ''}</a>

				<div className={'dropdown-container minimal-scrollbar dropdown-list'+(this.state.menuOpen || this.props.keepOpen ? ' open' : '')+(this.props.headerText ? ' has-header' : '')+(this.props.footerContent ? ' has-footer' : '')}
					style={dropdownStyle}>
					{
						this.props.headerText &&
						<div className="panel-heading dropdown-heading">
							<span className="heading-label">{this.props.headerText}</span>
						</div>
					}
					<div className={(this.props.containerType == 'text' ? 'text-container' : 'list-container')+' minimal-scrollbar'}>
						{this.props.children}
					</div>
					{
						this.props.footerContent &&
						<div className="dropdown-footer">
							{this.props.footerContent}
						</div>
					}
				</div>

			</div>
		);
	}
}