/**
 * Represents a simplified version of the SVGMatrix.
 */
export interface ITransformMatrix {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

/**
 * A utility class to transform between SVGMatrix and its simplified representation.
 */
export class TransformMatrix {
  public static toITransformMatrix(matrix: SVGMatrix): ITransformMatrix {
    return {
      a: matrix.a,
      b: matrix.b,
      c: matrix.c,
      d: matrix.d,
      e: matrix.e,
      f: matrix.f
    };
  }
  public static toSVGMatrix(
    currentMatrix: SVGMatrix,
    newMatrix: ITransformMatrix
  ): SVGMatrix {
    currentMatrix.a = newMatrix.a;
    currentMatrix.b = newMatrix.b;
    currentMatrix.c = newMatrix.c;
    currentMatrix.d = newMatrix.d;
    currentMatrix.e = newMatrix.e;
    currentMatrix.f = newMatrix.f;
    return currentMatrix;
  }
}
