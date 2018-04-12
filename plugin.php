<?php
/**
 * Plugin Name: GutenSpace Beats
 * Plugin URI: guten.space/beats
 * Description: beats is an easy way to share sequenced beats with the world
 * Author: Miles Elliott
 * Author URI: https://mileselliott.me
 * Version: 1.0.0
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
