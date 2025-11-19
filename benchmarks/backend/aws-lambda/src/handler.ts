import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

/**
 * @function pingHandler
 * @description Handles the ping request for the API Gateway.
 *
 * @param event The event object transmitted by API Gateway.
 * @returns The response object for API Gateway.
 */
export async function pingHandler(_event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  try {
    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ok: true,
      }),
    };

    console.log('Returning success response');
    return response;
  } catch (error) {
    console.error('Error during execution:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ok: false, error: 'Internal Server Error' }),
    };
  }
}
