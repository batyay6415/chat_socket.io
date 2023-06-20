import express from "express";
import routeNotFound from "./3-middleware/route-not-found";
import catchAll from "./3-middleware/catch-all";
import appConfig from "./4-utils/app-config";
import http from "http";
import socketIoService from "./5-services/socket.io-service";

const expressServer = express();

expressServer.use(routeNotFound);
expressServer.use(catchAll);

const httpServer = expressServer.listen(appConfig.port, () => console.log("Listening on http://localhost:" + appConfig.port));

// Init Socket.io logic:
socketIoService.init(httpServer);
