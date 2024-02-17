import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { PixelInfoClient } from '../../clients/pixel_info.client';
import { PositionDto } from '../../clients/pixel_info';

export const pixelInfoClient = new PixelInfoClient(
  new GrpcWebFetchTransport({
    baseUrl: 'http://localhost:8080',
  }),
);

export const equals = (position1: PositionDto | undefined, position2: PositionDto | undefined): boolean => {
  return position1?.x === position2?.x && position1?.y === position2?.y;
};
