import path from "node:path";
import { createLogger, format, transports } from "winston";
const { combine, timestamp, logstash, simple } = format;
const { Console, File } = transports;
export function getWinstonLogger() {
  return process.env.NODE_ENV === "production" ? getProductionLogger() : getDevelopmentLogger();
}
export function getProductionLogger() {
  const transports2 = [
    new Console(),
    new File({
      filename: "/var/log/combined.log",
      maxsize: 1e6,
      // in bytes (1MB)
      maxFiles: 5
    }),
    new File({
      filename: "/var/log/error.log",
      level: "error",
      maxsize: 1e6,
      // in bytes (1MB)
      maxFiles: 5
    })
  ];
  return createLogger({
    level: "info",
    format: combine(timestamp(), logstash()),
    transports: transports2
  });
}
export function getDevelopmentLogger() {
  if (!path || !import.meta.server) {
    throw new Error("Path module is not available on client side");
  }
  const logDir = path.resolve(process.cwd(), "./logs");
  const transports2 = [
    new Console(),
    new File({
      filename: path.join(logDir, "combined.log"),
      maxsize: 1e6,
      // in bytes (1MB)
      maxFiles: 1
    }),
    new File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 1e6,
      // in bytes (1MB)
      maxFiles: 1
    })
  ];
  return createLogger({
    level: "info",
    format: combine(simple()),
    transports: transports2
  });
}
