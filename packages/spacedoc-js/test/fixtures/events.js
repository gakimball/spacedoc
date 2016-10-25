class Kitty {
  /**
   * This function fires an event.
   * @fires Kitty#petted
   */
  static fire() {
    /**
     * Fires when a kitty has been pet.
     * @event Kitty#petted
     * @type {string}
     */
    this.emit('petted', 'yay!');
  }

  /**
   * This function listens for an event.
   * @listens Kitty#petted
   */
  static listen() {
    this.on('petted', e => console.log(e));
  }
}
