import { Container, Fade, Typography, Box } from '@mui/material';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import useIsMobile from '../hooks/useIsMobile';

interface Props {
    title: string;
    subtitle?: string;
}

function TitleSlide(props: Props) {
    const isMobile = useIsMobile();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 50%, rgba(241,245,249,0.95) 100%)',
                    zIndex: -1,
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '10%',
                    right: '5%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(147,51,234,0.06) 50%, transparent 70%)',
                    borderRadius: '50%',
                    zIndex: -1,
                    animation: 'float 6s ease-in-out infinite',
                },
                '@keyframes float': {
                    '0%, 100%': {
                        transform: 'translateY(0px) rotate(0deg)',
                    },
                    '50%': {
                        transform: 'translateY(-20px) rotate(180deg)',
                    },
                },
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    flexDirection: 'column',
                    p: { xs: 4, md: 6 },
                    boxSizing: 'border-box',
                    color: '#1D1D1F',
                }}
            >
                <Fade in={true} timeout={800}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            maxWidth: '85%',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '-20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60px',
                                height: '4px',
                                background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)',
                                borderRadius: '2px',
                                opacity: 0.8,
                            },
                        }}
                    >
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => (
                                    <Typography
                                        variant={isMobile ? 'h3' : 'h1'}
                                        component="h1"
                                        sx={{
                                            background: 'linear-gradient(135deg, #1D1D1F 0%, #374151 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontWeight: 700,
                                            textAlign: 'center',
                                            letterSpacing: '-0.03em',
                                            mb: props.subtitle ? { xs: 3, md: 4 } : 0,
                                            lineHeight: 1.1,
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                                            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        }}
                                    >
                                        {children}
                                    </Typography>
                                ),
                                h1: ({ children }) => (
                                    <Typography
                                        variant={isMobile ? 'h3' : 'h1'}
                                        component="h1"
                                        sx={{
                                            background: 'linear-gradient(135deg, #1D1D1F 0%, #374151 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontWeight: 700,
                                            textAlign: 'center',
                                            letterSpacing: '-0.03em',
                                            mb: props.subtitle ? { xs: 3, md: 4 } : 0,
                                            lineHeight: 1.1,
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                                            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        }}
                                    >
                                        {children}
                                    </Typography>
                                ),
                                h2: ({ children }) => (
                                    <Typography
                                        variant={isMobile ? 'h4' : 'h2'}
                                        component="h1"
                                        sx={{
                                            background: 'linear-gradient(135deg, #1D1D1F 0%, #374151 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontWeight: 700,
                                            textAlign: 'center',
                                            letterSpacing: '-0.03em',
                                            mb: props.subtitle ? { xs: 3, md: 4 } : 0,
                                            lineHeight: 1.1,
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                                            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        }}
                                    >
                                        {children}
                                    </Typography>
                                ),
                                strong: ({ children }) => (
                                    <Box
                                        component="span"
                                        sx={{ 
                                            fontWeight: 800,
                                            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        {children}
                                    </Box>
                                ),
                            }}
                        >
                            {props.title}
                        </ReactMarkdown>
                    </Box>
                </Fade>

                {props.subtitle &&
                    <Fade
                        in={true}
                        timeout={800}
                        style={{ transitionDelay: '300ms' }}
                    >
                        <Box
                            sx={{
                                textAlign: 'center',
                                maxWidth: '75%',
                                mt: 2,
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-15px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '40px',
                                    height: '2px',
                                    background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.3) 50%, transparent 100%)',
                                    borderRadius: '1px',
                                },
                            }}
                        >
                            <ReactMarkdown
                                components={{
                                    p: ({ children }) => (
                                        <Typography
                                            variant={isMobile ? 'h5' : 'h3'}
                                            component="p"
                                            textAlign="center"
                                            sx={{
                                                color: 'rgba(55, 65, 81, 0.8)',
                                                fontWeight: 400,
                                                lineHeight: 1.4,
                                                letterSpacing: '-0.01em',
                                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                                                textShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                            }}
                                        >
                                            {children}
                                        </Typography>
                                    ),
                                    h1: ({ children }) => (
                                        <Typography
                                            variant={isMobile ? 'h5' : 'h3'}
                                            component="h2"
                                            textAlign="center"
                                            sx={{
                                                color: 'rgba(55, 65, 81, 0.8)',
                                                fontWeight: 400,
                                                lineHeight: 1.4,
                                                letterSpacing: '-0.01em',
                                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                                                textShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                            }}
                                        >
                                            {children}
                                        </Typography>
                                    ),
                                    h2: ({ children }) => (
                                        <Typography
                                            variant={isMobile ? 'h6' : 'h4'}
                                            component="h3"
                                            textAlign="center"
                                            sx={{
                                                color: 'rgba(55, 65, 81, 0.8)',
                                                fontWeight: 400,
                                                lineHeight: 1.4,
                                                letterSpacing: '-0.01em',
                                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                                                textShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                            }}
                                        >
                                            {children}
                                        </Typography>
                                    ),
                                    strong: ({ children }) => (
                                        <Box
                                            component="span"
                                            sx={{ 
                                                fontWeight: 600,
                                                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
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
                                                color: 'rgba(59, 130, 246, 0.7)',
                                                fontWeight: 500,
                                            }}
                                        >
                                            {children}
                                        </Box>
                                    ),
                                }}
                            >
                                {props.subtitle}
                            </ReactMarkdown>
                        </Box>
                    </Fade>
                }
            </Container>
        </Box>
    );
}

export default TitleSlide;
