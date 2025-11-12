# FastMap

A simple 2D map that is optimized for performance.

 * Internally, it is a 1D array that is accessed using 2D coordinates. This makes is extremely performant for larger maps, as it avoids the overhead and mess of nested arrays.
 * Inspired by the CImage class in Vladimir Kovalevsky's book "Modern Algorithms for Image Processing"
