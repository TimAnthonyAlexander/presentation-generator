import { Box, Container, Fade, Typography } from '@mui/material';
import { FormatQuoteRounded } from '@mui/icons-material';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import useIsMobile from '../hooks/useIsMobile';

interface Props {
    title: string;
    quote: string;
    author?: string;
    source?: string;
}

function QuoteSlide(props: Props) {
    const isMobile = useIsMobile();

    return (
        <Container
            maxWidth="lg"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                p: { xs: 3, md: 8 },
                boxSizing: 'border-box',
                color: '#1D1D1F',
            }}
        >
            <Fade in={true} timeout={500}>
                <Typography
                    variant={isMobile ? 'h5' : 'h3'}
                    sx={{
                        color: '#1D1D1F',
                        fontWeight: 600,
                        mb: { xs: 4, md: 6 },
                        textAlign: 'center',
                        letterSpacing: '-0.02em',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}
                >
                    {props.title}
                </Typography>
            </Fade>

            <Fade
                in={true}
                timeout={700}
                style={{ transitionDelay: '200ms' }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        textAlign: 'center',
                        maxWidth: '85%',
                        mt: 2,
                    }}
                >
                    {/* Opening quote */}
                    <FormatQuoteRounded
                        sx={{
                            position: 'absolute',
                            top: -10,
                            left: -20,
                            fontSize: { xs: 36, md: 48 },
                            color: 'rgba(0, 0, 0, 0.12)',
                            transform: 'rotate(180deg)',
                        }}
                    />

                    {/* Quote text with markdown support */}
                    <Box
                        sx={{
                            px: { xs: 2, md: 4 },
                        }}
                    >
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => (
                                    <Typography
                                        variant={isMobile ? 'h5' : 'h3'}
                                        component="p"
                                        sx={{
                                            color: '#1D1D1F',
                                            fontStyle: 'italic',
                                            fontWeight: 300,
                                            lineHeight: 1.4,
                                            mb: { xs: 3, md: 4 },
                                            letterSpacing: '0.01em',
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                                        }}
                                    >
                                        "{children}"
                                    </Typography>
                                ),
                                strong: ({ children }) => (
                                    <Box
                                        component="span"
                                        sx={{ 
                                            fontWeight: 500,
                                            color: '#000000',
                                        }}
                                    >
                                        {children}
                                    </Box>
                                ),
                                em: ({ children }) => (
                                    <Box
                                        component="span"
                                        sx={{ 
                                            fontStyle: 'italic',
                                            color: 'rgba(0, 0, 0, 0.7)',
                                        }}
                                    >
                                        {children}
                                    </Box>
                                ),
                            }}
                        >
                            {props.quote}
                        </ReactMarkdown>
                    </Box>

                    {/* Closing quote */}
                    <FormatQuoteRounded
                        sx={{
                            position: 'absolute',
                            bottom: props.author || props.source ? 60 : 10,
                            right: -20,
                            fontSize: { xs: 36, md: 48 },
                            color: 'rgba(0, 0, 0, 0.12)',
                        }}
                    />
                </Box>
            </Fade>

            {/* Attribution */}
            {(props.author || props.source) && (
                <Fade
                    in={true}
                    timeout={700}
                    style={{ transitionDelay: '500ms' }}
                >
                    <Box
                        sx={{
                            textAlign: 'center',
                            mt: 2,
                        }}
                    >
                        {props.author && (
                            <Typography
                                variant={isMobile ? 'h6' : 'h5'}
                                sx={{
                                    color: 'rgba(0, 0, 0, 0.7)',
                                    fontWeight: 500,
                                    mb: props.source ? 1 : 0,
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                                }}
                            >
                                — {props.author}
                            </Typography>
                        )}
                        {props.source && (
                            <Typography
                                variant={isMobile ? 'body1' : 'h6'}
                                sx={{
                                    color: 'rgba(0, 0, 0, 0.5)',
                                    fontStyle: 'italic',
                                    fontWeight: 400,
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                                }}
                            >
                                {props.source}
                            </Typography>
                        )}
                    </Box>
                </Fade>
            )}
        </Container>
    );
}

export default QuoteSlide; 
