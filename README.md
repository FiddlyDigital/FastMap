# FastMap

An simple alternative to 2D arrays, with comparative performance.

## Benefits:

- Memory Efficient 
  - Built on a 1d array; Uses a single contiguous block of memory
  - Fewer object allocations = less garbage collection overhead
  - Better memory layout for very large maps

- Cleaner API and Type Safety
  - Single generic type: `FastMap<T>` vs `T[][]`
  - No need to manage nested array initialization
  - Consistent bounds checking across all operations (with safe Get/Set methods)

## Usage:

Let's be honest: If you're just storing simple data and don't need safety guarantees, _a 2D array is simpler_. 

FastMap is best used for:
- Game dev (tile maps, grids where safety + performance matter)
- Image processing (pixel buffers)
- Large grid simulations
- Other cases where you want built-in bounds checking without manual if statements

## How to use:
`npm install "@speakingsoftware/fastmap"`

``` typescript
import { FastMap } from '@speakingsoftware/fastmap';

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
```

----------

Inspired by the CImage class in Vladimir Kovalevsky's book "Modern Algorithms for Image Processing"





