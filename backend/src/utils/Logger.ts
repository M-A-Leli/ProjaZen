import { createLogger, transports, format } from 'winston';
import path from 'path';
import { TransformableInfo } from 'logform';

const { combine, timestamp, printf, errors } = format;

// Define your custom format with stack trace sanitization
const customFormat = printf(({ level, message, timestamp, stack }: TransformableInfo) => {
  // Function to sanitize the stack trace
  const sanitizeStack = (stack: string | undefined) => {
    if (!stack) return '';
    const projectRoot = path.resolve(__dirname, '..'); // Adjust according to your project structure
    return stack.split('\n').map(line =>
      line.replace(projectRoot, '').replace(/\\/g, '/')
    ).join('\n');
  };

  const sanitizedStack = sanitizeStack(stack);

  return `${timestamp} ${level}: ${sanitizedStack || message}`;
});

// Create a Winston logger instance
const logger = createLogger({
  level: 'error', // Adjust the level to capture errors only
  format: combine(
    timestamp(),      // Add timestamp to each log entry
    errors({ stack: true }), // Capture stack trace
    customFormat      // Use custom format
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, '..', 'logs', 'error.log') }),
    // new transports.Console() // Optionall
  ]
});

export default logger;
