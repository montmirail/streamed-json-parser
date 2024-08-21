export class StreamingJsonParser {
  /**
   * Keep track of the current token type between consume calls
   * @private
   */
  private _isNextTokenKey = true;
  private _isCurrentTokenKey = false;
  private _isNextTokenValue = false;
  private _isCurrentTokenValue = false;


  /**
   * Hold the key of the next value to be inserted
   * @private
   */
  private _currentKey = '';

  /**
   * Current working object
   * @private
   */
  private _currentObject = null;

  /**
   * Keep track of the full key of the current object in the parsed object
   * When the current cursor is an empty string we are working on the root object
   * @private
   */
  private _currentCursor: string[] = [];

  /**
   * The final object to be returned
   * @private
   */
  private _parsed: object = null;

  public consume(value: string) {
    for(const token of value) {
      const handler = this._handlers[token];

      if (handler) {
        handler();
      } else if(this._isCurrentTokenKey) {
        this._currentKey += token;
      } else if(this._isCurrentTokenValue){
        this._currentObject[this._currentKey] += token;
      }
    }
  }

  public get() {
    return this._parsed;
  }

  private _handlers = {
    '"': () => {
      if (this._isNextTokenKey) {
        /**
         * Key started
         */
        this._isCurrentTokenKey = true;
        this._isNextTokenKey = false;
      } else if (this._isCurrentTokenKey) {
        /**
         * Key ended
         */
        this._isCurrentTokenKey = false;
        this._isNextTokenValue = true;
        this._currentObject[this._currentKey] = '';
      } else if (this._isNextTokenValue) {
        this._isNextTokenValue = false;
        this._isCurrentTokenValue = true;
      } else if (this._isCurrentTokenValue) {
        /**
         * End of current value
         */
        this._isNextTokenKey = true;
        this._isCurrentTokenValue = false;
        this._isCurrentTokenKey = false;
        this._currentKey = '';
      }
    },
    "{": () => {
      if (this._parsed === null) {
        this._parsed = {}
        this._currentObject = this._parsed;
      } else {
        this._isNextTokenKey = true;
        this._currentObject[this._currentKey] = {};
        this._currentObject = this._currentObject[this._currentKey];
        this._currentCursor.push(this._currentKey);
        this._currentKey = '';
      }
    },
    "}": () => {
      if (!this._currentCursor.pop()) {
        return;
      }

      this._currentObject = this._parsed;

      for (const key of this._currentCursor) {
        this._currentObject = this._currentObject[key];
      }
    }
  }
}
