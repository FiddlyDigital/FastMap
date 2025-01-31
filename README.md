# FastMap

A simple 2D map that is optimized for speed.

 * Internally, it is a 1D array that is accessed using 2D coordinates. This makes is extremely fast for large maps, as it avoids the overhead and mess of nested arrays.
 * Inspired by the CImage class in Vladimir Kovalevsky's book "Modern Algorithms for Image Processing"
