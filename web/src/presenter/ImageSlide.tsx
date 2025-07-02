import { Box, Container, Fade, Typography } from '@mui/material';
import { useState } from 'react';
import useIsMobile from '../hooks/useIsMobile';

interface Props {
    title: string;
    url: string;
}

function ImageSlide(props: Props) {
    const isMobile = useIsMobile();
    const [imageLoaded, setImageLoaded] = useState(false);

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
                    variant={isMobile ? 'h4' : 'h2'}
                    sx={{
                        color: '#1D1D1F',
                        fontWeight: 700,
                        mb: { xs: 4, md: 6 },
                        textAlign: 'center',
                        letterSpacing: '-0.025em',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}
                >
                    {props.title}
                </Typography>
            </Fade>

            <Fade
                in={imageLoaded}
                timeout={700}
                style={{ transitionDelay: '200ms' }}
            >
                <Box
                    sx={{
                        maxWidth: '90%',
                        maxHeight: '70%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
                        transition: 'transform 0.3s ease-out',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 16px 30px rgba(0, 0, 0, 0.12)',
                        }
                    }}
                >
                    <img
                        src={props.url}
                        alt={props.title}
                        onLoad={() => setImageLoaded(true)}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            borderRadius: '8px',
                        }}
                    />
                </Box>
            </Fade>

            {/* Loading placeholder */}
            {!imageLoaded && (
                <Box
                    sx={{
                        width: { xs: 200, md: 300 },
                        height: { xs: 150, md: 200 },
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.03)',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        '@keyframes pulse': {
                            '0%, 100%': {
                                opacity: 0.6,
                            },
                            '50%': {
                                opacity: 0.3,
                            },
                        },
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'rgba(0, 0, 0, 0.4)',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                            fontSize: '0.95rem',
                        }}
                    >
                        Loading image...
                    </Typography>
                </Box>
            )}
        </Container>
    );
}

export default ImageSlide;
