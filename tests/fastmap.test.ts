import { FastMap } from '../src/index';

describe('FastMap', () => {
    describe('constructor', () => {
        it('should create a map with the specified dimensions', () => {
            const map = new FastMap<number>(3, 4);
            expect(map.Width()).toBe(3);
            expect(map.Height()).toBe(4);
        });

        it('should initialize all values to null', () => {
            const map = new FastMap<string>(2, 2);
            for (let y = 0; y < 2; y++) {
                for (let x = 0; x < 2; x++) {
                    expect(map.Get(x, y)).toBeNull();
                }
            }
        });
    });

    describe('Get method', () => {
        let map: FastMap<number>;

        beforeEach(() => {
            map = new FastMap<number>(3, 3);
        });

        it('should return null for unset values', () => {
            expect(map.Get(0, 0)).toBeNull();
        });

        it('should throw error for negative x coordinate', () => {
            expect(() => map.Get(-1, 0)).toThrow('Index out of bounds');
        });

        it('should throw error for negative y coordinate', () => {
            expect(() => map.Get(0, -1)).toThrow('Index out of bounds');
        });

        it('should throw error for x coordinate >= width', () => {
            expect(() => map.Get(3, 0)).toThrow('Index out of bounds');
        });

        it('should throw error for y coordinate >= height', () => {
            expect(() => map.Get(0, 3)).toThrow('Index out of bounds');
        });
    });

    describe('Set method', () => {
        let map: FastMap<number>;

        beforeEach(() => {
            map = new FastMap<number>(3, 3);
        });

        it('should set and retrieve a value correctly', () => {
            map.Set(1, 2, 42);
            expect(map.Get(1, 2)).toBe(42);
        });

        it('should override existing values', () => {
            map.Set(1, 1, 10);
            map.Set(1, 1, 20);
            expect(map.Get(1, 1)).toBe(20);
        });

        it('should allow setting null values', () => {
            map.Set(0, 0, 42);
            map.Set(0, 0, null);
            expect(map.Get(0, 0)).toBeNull();
        });

        it('should throw error for out of bounds coordinates', () => {
            expect(() => map.Set(3, 0, 42)).toThrow('Index out of bounds');
            expect(() => map.Set(0, 3, 42)).toThrow('Index out of bounds');
            expect(() => map.Set(-1, 0, 42)).toThrow('Index out of bounds');
            expect(() => map.Set(0, -1, 42)).toThrow('Index out of bounds');
        });
    });

    describe('different data types', () => {
        it('should work with strings', () => {
            const map = new FastMap<string>(2, 2);
            map.Set(0, 1, 'hello');
            expect(map.Get(0, 1)).toBe('hello');
        });

        it('should work with objects', () => {
            const map = new FastMap<{ value: number }>(2, 2);
            const obj = { value: 42 };
            map.Set(1, 1, obj);
            expect(map.Get(1, 1)).toEqual(obj);
        });

        it('should work with arrays', () => {
            const map = new FastMap<number[]>(2, 2);
            const arr = [1, 2, 3];
            map.Set(0, 0, arr);
            expect(map.Get(0, 0)).toEqual(arr);
        });
    });

    describe('large maps', () => {
        it('should handle large dimensions', () => {
            const width = 1000;
            const height = 1000;
            const map = new FastMap<number>(width, height);

            // Test corners
            map.Set(0, 0, 1);
            map.Set(width - 1, 0, 2);
            map.Set(0, height - 1, 3);
            map.Set(width - 1, height - 1, 4);

            expect(map.Get(0, 0)).toBe(1);
            expect(map.Get(width - 1, 0)).toBe(2);
            expect(map.Get(0, height - 1)).toBe(3);
            expect(map.Get(width - 1, height - 1)).toBe(4);
        });
    });

    // New performance tests
    describe('performance', () => {
        it('should perform well with random access', () => {
            const width = 1000;
            const height = 1000;
            const map = new FastMap<number>(width, height);
            const operations = 10000;
            const startTime = performance.now();

            for (let i = 0; i < operations; i++) {
                const x = Math.floor(Math.random() * width);
                const y = Math.floor(Math.random() * height);
                map.Set(x, y, i);
                expect(map.Get(x, y)).toBe(i);
            }

            const totalTime = performance.now() - startTime;
            expect(totalTime).toBeLessThan(1000); // Should complete in less than 1 second
        });
    });

    // Additional edge cases
    describe('edge cases', () => {
        it('should handle non-square dimensions', () => {
            const map = new FastMap<number>(1, 100);
            map.Set(0, 99, 42);
            expect(map.Get(0, 99)).toBe(42);
        });

        it('should handle sparse data', () => {
            const map = new FastMap<number>(100, 100);
            const sparsePoints = [
                [0, 0], [99, 99], [50, 50], [25, 75], [75, 25]
            ];

            sparsePoints.forEach(([x, y], i) => {
                map.Set(x, y, i);
            });

            sparsePoints.forEach(([x, y], i) => {
                expect(map.Get(x, y)).toBe(i);
            });

            // Check some empty spaces
            expect(map.Get(1, 1)).toBeNull();
            expect(map.Get(98, 98)).toBeNull();
        });
    });

    // Specific use cases
    describe('use cases', () => {
        it('should work as a simple game board', () => {
            const board = new FastMap<string>(8, 8);
            // Place some chess pieces
            board.Set(0, 0, 'rook');
            board.Set(1, 0, 'knight');
            board.Set(4, 0, 'king');

            // Move a piece
            const piece = board.Get(1, 0);
            board.Set(1, 0, null);
            board.Set(2, 2, piece);

            expect(board.Get(2, 2)).toBe('knight');
            expect(board.Get(1, 0)).toBeNull();
        });

        it('should work as a tile map', () => {
            const tiles = new FastMap<string>(10, 10);
            const tileTypes = ['grass', 'water', 'mountain'];

            // Create a simple terrain
            for (let y = 0; y < 10; y++) {
                for (let x = 0; x < 10; x++) {
                    const tileIndex = (x + y) % tileTypes.length;
                    tiles.Set(x, y, tileTypes[tileIndex]);
                }
            }

            // Verify terrain pattern
            for (let y = 0; y < 10; y++) {
                for (let x = 0; x < 10; x++) {
                    const expectedTile = tileTypes[(x + y) % tileTypes.length];
                    expect(tiles.Set(x, y, expectedTile));
                }
            }
        });

        it('should work as a pixel buffer', () => {
            interface RGB {
                r: number;
                g: number;
                b: number;
            }

            const image = new FastMap<RGB>(100, 100);

            // Draw a simple gradient
            for (let y = 0; y < 100; y++) {
                for (let x = 0; x < 100; x++) {
                    image.Set(x, y, {
                        r: Math.floor(255 * (x / 100)),
                        g: Math.floor(255 * (y / 100)),
                        b: 128
                    });
                }
            }

            // Verify some pixel values
            const topLeft = image.Get(0, 0);
            expect(topLeft?.r).toBe(0);
            expect(topLeft?.g).toBe(0);
            expect(topLeft?.b).toBe(128);

            const bottomRight = image.Get(99, 99);
            expect(bottomRight?.r).toBe(252);
            expect(bottomRight?.g).toBe(252);
            expect(bottomRight?.b).toBe(128);
        });
    });
});