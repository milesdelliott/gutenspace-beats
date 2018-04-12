/**
 * BLOCK: beats
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

import Sequencer from '../components/sequencer';


const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType, InspectorControls, BlockControls } = wp.blocks; // Import registerBlockType() from wp.blocks
const { RangeControl } = wp.components;

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'gs/beats', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Beats' ), // Block title.
	icon: 'controls-volumeon', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'beats' ),
	],

	attributes: {
		steps: {
			type: 'number',
			default: 4,
		}
	},

	edit: function( props ) {
		const onChange = ( newSteps ) => {
			props.setAttributes({steps: newSteps});
		};
		return [ props.focus && (
			<InspectorControls>
				<RangeControl
					label="Steps"
					value={ props.attributes.steps }
					onChange={ onChange }
					min={ 4 }
					max={ 16 }
				/>
			</InspectorControls>
		),
			props.focus && (
				<BlockControls>
					<RangeControl
						label="Steps"
						value={ props.attributes.steps }
						onChange={ onChange }
						min={ 4 }
						max={ 16 }
					/>
				</BlockControls>
			),
			<div className={props.className}>
				<Sequencer steps={props.attributes.steps} />
			</div>
		];
	},


	save: function( props ) {
		return (
			<div className={ props.className }>

			</div>
		);
	},
} );
