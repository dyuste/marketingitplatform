import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SiteImageGallery from 'shared/components/images/siteImageGallery/SiteImageGallery'

export class BsSiteImageGallery extends Component {
	constructor(props) {
		super(props);
		this.state = {showGallery: false};
	}

	render() {
		let image = this.props.image;
		let hasImage = this.props.checked;
		let showGallery = this.state.showGallery;
		var editor = null;
		var gallery = null;

		let thumbnail = hasImage && image && image.thumbnailUrl
			? <div className="thumbnail"><img src={image.thumbnailUrl} /></div> 
			: <div className="thumbnail no-image"><span>Sin imagen</span></div>;
		let hintLabelId = this.props.name + "_hint";
		return (
			<div>
				<div className="form-group bs-image-gallery">
					<div className="form-control">
						<input type="checkbox" className="form-check-input" name={this.props.name} id={this.props.name} checked={this.props.checked} onChange={() => this.props.onCheckChange(!this.props.checked)} />
						<label className="form-check-label" htmlFor={this.props.name}>{this.props.label}</label>
						{hasImage && <div className="border-top-dashed clear-fix" style={{height: "78px", width: "100%", paddingTop: "8px"}}>
							<div className="float-left">{thumbnail}</div>
							<div className="float-left">{!showGallery && <button className="btn btn-link" onClick={() => this.setState({showGallery: !showGallery})}>Seleccionar imagen</button>}</div>

						</div>

						}
					</div>
					{this.props.hintLabel && <small id={this.props.name + "_hint"} className="form-text text-muted">{this.props.hintLabel}</small>}
				</div>
				{showGallery && <SiteImageGallery 
							selectedImageId={image ? image.id : null}
							onImageSelected={(image) => {
								this.setState({showGallery: !showGallery});
								this.props.onImageSelected(image);
							}}
							onCancel={() => this.setState({showGallery: !showGallery})}
						/>}
			</div>
		);
	}
}

BsSiteImageGallery.propTypes = {
	checked: PropTypes.bool.isRequired,
	image: PropTypes.object,
	label: PropTypes.string.isRequired,
	hintLabel: PropTypes.string,
	name: PropTypes.string.isRequired,
	onCheckChange: PropTypes.func.isRequired,
	onImageSelected: PropTypes.func.isRequired
};

export default BsSiteImageGallery; 
