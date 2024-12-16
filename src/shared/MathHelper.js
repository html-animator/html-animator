export default class MathHelper {
    static min(...args) {
        return args.reduce((acc, val) => {
            return acc < val ? acc : val;
        });
    }

    static max(...args) {
        return args.reduce((acc, val) => {
            return acc > val ? acc : val;
        });
    }

    static applyMatrixToPoint(matrix, point) {
        return {
            x: point.x * matrix.a + point.y * matrix.c + matrix.e,
            y: point.x * matrix.b + point.y * matrix.d + matrix.f
        };
    }

    static getTransformedBoundingBox(transform, boundingBox) {
        const topLeft = MathHelper.applyMatrixToPoint(transform, { x: boundingBox.x, y: boundingBox.y });
        const topRight = MathHelper.applyMatrixToPoint(transform, { x: boundingBox.x + boundingBox.width, y: boundingBox.y });
        const bottomLeft = MathHelper.applyMatrixToPoint(transform, { x: boundingBox.x, y: boundingBox.y + boundingBox.height });
        const bottomRight = MathHelper.applyMatrixToPoint(transform, { x: boundingBox.x + boundingBox.width, y: boundingBox.y + boundingBox.height });
        const minX = MathHelper.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
        const minY = MathHelper.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
        const maxX = MathHelper.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
        const maxY = MathHelper.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }
}
