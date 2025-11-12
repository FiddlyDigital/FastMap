/**
 * A simple 2D map that is optimized for speed.
 * Internally, it is a 1D array that is accessed using 2D coordinates.
 * This makes is extremely fast for large maps, as it avoids the overhead and mess of nested arrays.
 * Inspired by the CImage class in Vladimir Kovalevsky's book "Modern Algorithms for Image Processing"
 */
export class FastMap<T> {
    private map: Array<T | undefined> = [];
    private width: number = 0;
    private height: number = 0;

    /**
     * Creates a new FastMap with the given width and height
     * @constructor
     * @param width The width of the map
     * @param height The height of the map
     * @throws {Error} If the given width or height are not integers, are less than or equal to 0, or if the dimensions are too large
     */
    public constructor(width: number, height: number) {
        // Check if numbers are valid, throw if not
        this.validateSize(width, height);

        this.width = width;
        this.height = height;
        this.map = new Array<T | undefined>(width * height);
    }

    /**
     * Gets a value from the map at the given coordinates
     * @param {number} x horizontal index
     * @param {number} y vertical index
     * @throws {Error} If the given indices are not integers, or out of bounds
     * @returns {T | undefined} The value at the given coordinates, or undefined if there is no value there
     * @remarks This method performs bounds checking so inherintly has some overhead. For performance-critical code, consider using GetUnsafe instead.
     */
    public Get(x: number, y: number): T | undefined {
        if (!this.checkIndicesAreValid(x, y)) {
            throw new Error("Index out of bounds");
        }
        return this.map[this.convert2DTo1D(x, y)];
    }

    /**
     * Puts a value into the map at the given coordinates
     * @param {number} x horizontal index
     * @param {number} y vertical index
     * @param {number} value The value to place, that is either of type T or undefined
     * @throws {Error} If the given indices are not integers, or out of bounds
     * @returns {void} Nothing
     * @remarks This method performs bounds checking so inherintly has some overhead. For performance-critical code, consider using SetUnsafe instead.
     */
    public Set(x: number, y: number, value: T | undefined): void {
        if (!this.checkIndicesAreValid(x, y)) {
            throw new Error("Index out of bounds");
        }

        this.map[this.convert2DTo1D(x, y)] = value;
    }

    /**
     * Gets a value from the map at the given coordinates without bounds checking
     * WARNING: This is unsafe and will cause undefined behavior if coordinates are out of bounds!
     * Only use this in performance-critical code where you are certain the coordinates are valid.
     * @param {number} x horizontal index
     * @param {number} y vertical index
     * @returns {T | undefined} The value at the given coordinates, or undefined if there is no value there
     */
    public GetUnsafe(x: number, y: number): T | undefined {
        return this.map[y * this.width + x];
    }

    /**
     * Puts a value into the map at the given coordinates without bounds checking
     * WARNING: This is unsafe and will cause undefined behavior if coordinates are out of bounds!
     * Only use this in performance-critical code where you are certain the coordinates are valid.
     * @param {number} x horizontal index
     * @param {number} y vertical index
     * @param {number} value The value to place, that is either of type T or undefined
     * @returns {void} Nothing
     */
    public SetUnsafe(x: number, y: number, value: T | undefined): void {
        this.map[y * this.width + x] = value;
    }

    /**
     * Gets the width of the map
     * @returns {number} The width of the map
     */
    public Width(): number {
        return this.width;
    }

    /**
     * Gets the height of the map
     * @returns {number} The height of the map
     */
    public Height(): number {
        return this.height;
    }

    /**
     * Takes 2D coordinates and converts them to a 1D index
     * @param {number} x horizontal index (as this is called post validation, will always be an integer)
     * @param {number} y vertical index   (as this is called post validation, will always be an integer)
     * @returns {number} The 1D index of the 2D coordinates
     */
    private convert2DTo1D(x: number, y: number): number {
        return y * this.width + x;
    }

    /**
     * Checks if the given indices are within the bounds of the map
     * @param {number} x horizontal index
     * @param {number} y vertical index
     * @returns {boolean} true if both indices are valid; false if not
     */
    private checkIndicesAreValid(x: number, y: number): boolean {
        return (
            Number.isInteger(x) &&
            Number.isInteger(y) &&
            x >= 0 &&
            x < this.width &&
            y >= 0 &&
            y < this.height
        );
    }

    /**
     * Throws an error if the given width and height are invalid
     * @param width the width of the map
     * @param height the height of the map
     */
    private validateSize(width: number, height: number): void {
        if (!Number.isInteger(width) || !Number.isInteger(height)) {
            throw new Error("Width and Height must be Integer values");
        }

        if (width <= 0 || height <= 0) {
            throw new Error("Width and height must be greater than 0");
        }

        // For arrays, the maximum length is (2 to the power of 32, -1)
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Invalid_array_length#:~:text=For%20arrays%2C%20the%20maximum%20length%20is%20232%2D1
        if ((width * height) > (Math.pow(2, 32) - 1)) {
            throw new Error("Specified dimensions are too large");
        }
    }
}