import { Box, Container, Fade, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import useIsMobile from '../hooks/useIsMobile';

interface Props {
    title: string;
    text: string;
    imageUrl?: string;
    imagePosition?: 'top' | 'bottom' | 'left' | 'right';
    imageCaption?: string;
    sources?: string[];
}

function TextSlide(props: Props) {
    const isMobile = useIsMobile();
    const [imageLoaded, setImageLoaded] = useState(false);

    const ImageComponent = () => (
        <>
            {props.imageUrl && (
                <Fade in={imageLoaded} timeout={600}>
                    <Box
                        sx={{
                            maxWidth: props.imagePosition === 'left' || props.imagePosition === 'right' ? '100%' : '70%',
                            maxHeight: props.imagePosition === 'top' || props.imagePosition === 'bottom' ? '40%' : '60%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
                            mb: props.imageCaption ? 1 : 0,
                        }}
                    >
                        <img
                            src={props.imageUrl}
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
            )}
            {props.imageUrl && !imageLoaded && (
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
                            '0%, 100%': { opacity: 0.6 },
                            '50%': { opacity: 0.3 },
                        },
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{ color: 'rgba(0, 0, 0, 0.4)' }}
                    >
                        Loading...
                    </Typography>
                </Box>
            )}
            {props.imageCaption && imageLoaded && (
                <Fade in={imageLoaded} timeout={500} style={{ transitionDelay: '150ms' }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(0, 0, 0, 0.6)',
                            fontStyle: 'italic',
                            textAlign: 'center',
                            mt: 1,
                            fontSize: { xs: '0.8rem', md: '0.9rem' },
                            letterSpacing: '0.01em',
                        }}
                    >
                        {props.imageCaption}
                    </Typography>
                </Fade>
            )}
        </>
    );

    const TextComponent = () => (
        <Fade
            in={true}
            timeout={600}
            style={{ transitionDelay: '200ms' }}
        >
            <Box>
                <Box
                    sx={{
                        color: '#1D1D1F',
                        maxWidth: '100%',
                        lineHeight: 1.5,
                        fontWeight: 400,
                        fontSize: isMobile ? '1.1rem' : '1.25rem',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                        letterSpacing: '-0.011em',
                        '& h1, & h2, & h3, & h4, & h5, & h6': {
                            color: '#1D1D1F',
                            fontWeight: 600,
                            marginBottom: '1rem',
                            marginTop: '1.5rem',
                            letterSpacing: '-0.02em',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                        },
                        '& p': {
                            marginBottom: '1rem',
                            color: '#1D1D1F',
                        },
                        '& strong': {
                            fontWeight: 600,
                            color: '#000000',
                        },
                        '& em': {
                            fontStyle: 'italic',
                            color: 'rgba(0, 0, 0, 0.7)',
                        },
                        '& ul, & ol': {
                            paddingLeft: '1.5rem',
                            marginBottom: '1rem',
                        },
                        '& li': {
                            marginBottom: '0.5rem',
                            color: '#1D1D1F',
                        },
                        '& blockquote': {
                            borderLeft: '3px solid rgba(0, 0, 0, 0.1)',
                            paddingLeft: '1rem',
                            marginLeft: '1rem',
                            fontStyle: 'italic',
                            color: 'rgba(0, 0, 0, 0.7)',
                        },
                        '& code': {
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            padding: '0.2rem 0.4rem',
                            borderRadius: '4px',
                            fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                            fontSize: '0.9em',
                        },
                    }}
                >
                    <ReactMarkdown
                        components={{
                            p: ({ children }) => (
                                <Typography 
                                    variant={isMobile ? 'body1' : 'h6'} 
                                    component="p"
                                    sx={{ 
                                        mb: 2, 
                                        color: 'inherit', 
                                        lineHeight: 1.5,
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                                    }}
                                >
                                    {children}
                                </Typography>
                            ),
                            h1: ({ children }) => (
                                <Typography variant={isMobile ? 'h5' : 'h3'} component="h1" sx={{ mb: 2, color: 'inherit', fontWeight: 600 }}>
                                    {children}
                                </Typography>
                            ),
                            h2: ({ children }) => (
                                <Typography variant={isMobile ? 'h6' : 'h4'} component="h2" sx={{ mb: 2, color: 'inherit', fontWeight: 600 }}>
                                    {children}
                                </Typography>
                            ),
                            h3: ({ children }) => (
                                <Typography variant={isMobile ? 'subtitle1' : 'h5'} component="h3" sx={{ mb: 1.5, color: 'inherit', fontWeight: 600 }}>
                                    {children}
                                </Typography>
                            ),
                        }}
                    >
                        {props.text}
                    </ReactMarkdown>
                </Box>
                
                {props.sources && props.sources.length > 0 && (
                    <Box sx={{ mt: { xs: 3, md: 4 } }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                color: 'rgba(0, 0, 0, 0.8)',
                                fontWeight: 600,
                                mb: 2,
                                fontSize: { xs: '0.9rem', md: '1rem' },
                                letterSpacing: '0.02em',
                            }}
                        >
                            Sources
                        </Typography>
                        <Box
                            sx={{
                                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                                borderRadius: 2,
                                p: { xs: 2, md: 2.5 },
                                border: '1px solid rgba(0, 0, 0, 0.05)',
                            }}
                        >
                            {props.sources.map((source, index) => (
                                <Typography
                                    key={index}
                                    variant="body2"
                                    sx={{
                                        color: 'rgba(0, 0, 0, 0.7)',
                                        mb: index < props.sources!.length - 1 ? 1.5 : 0,
                                        fontSize: { xs: '0.8rem', md: '0.9rem' },
                                        lineHeight: 1.5,
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                                        '&::before': {
                                            content: `"${index + 1}. "`,
                                            fontWeight: 600,
                                            color: 'rgba(0, 0, 0, 0.6)',
                                        },
                                    }}
                                >
                                    {source}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>
        </Fade>
    );

    // Render based on image position
    const renderContent = () => {
        if (!props.imageUrl) {
            return (
                <Box sx={{ maxWidth: { xs: '100%', md: '85%' } }}>
                    <TextComponent />
                </Box>
            );
        }

        switch (props.imagePosition) {
            case 'top':
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <Box sx={{ mb: { xs: 3, md: 4 } }}>
                            <ImageComponent />
                        </Box>
                        <Box sx={{ maxWidth: { xs: '100%', md: '80%' } }}>
                            <TextComponent />
                        </Box>
                    </Box>
                );
            case 'bottom':
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <Box sx={{ maxWidth: { xs: '100%', md: '80%' }, mb: { xs: 3, md: 4 } }}>
                            <TextComponent />
                        </Box>
                        <ImageComponent />
                    </Box>
                );
            case 'left':
                return (
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <ImageComponent />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <TextComponent />
                        </Grid>
                    </Grid>
                );
            case 'right':
                return (
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={7}>
                            <TextComponent />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <ImageComponent />
                            </Box>
                        </Grid>
                    </Grid>
                );
            default:
                return (
                    <Box sx={{ maxWidth: { xs: '100%', md: '80%' } }}>
                        <TextComponent />
                    </Box>
                );
        }
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                p: { xs: 3, md: 8 },
                boxSizing: 'border-box',
                color: '#1D1D1F',
                justifyContent: 'flex-start',
                pt: { xs: 6, md: 10 },
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

            {renderContent()}
        </Container>
    );
}

export default TextSlide;
