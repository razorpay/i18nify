import { Box, Heading } from '@razorpay/blade/components';
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true });
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flex={1}
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Heading size="large" color="surface.text.primary.normal">
            Something went wrong!
          </Heading>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
