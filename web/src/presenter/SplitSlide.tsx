import { Box, Container, Fade, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import useIsMobile from '../hooks/useIsMobile';

interface Props {
    title: string;
    leftContent: string;
    rightContent: string;
    imageUrl?: string;
    imagePosition?: 'left' | 'right';
}

function SplitSlide(props: Props) {
    const isMobile = useIsMobile();
    const [imageLoaded, setImageLoaded] = useState(false);

    const ContentBox = ({ children, isImageSide = false }: { children: React.ReactNode, isImageSide?: boolean }) => (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: isImageSide && props.imageUrl ? 'center' : 'flex-start',
                alignItems: isImageSide && props.imageUrl ? 'center' : 'flex-start',
                p: { xs: 2.5, md: 3.5 },
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                borderRadius: 2,
                border: '1px solid rgba(0, 0, 0, 0.06)',
                transition: 'transform 0.3s ease-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.06)'
                }
            }}
        >
            {children}
        </Box>
    );

    const TextContent = ({ content }: { content: string }) => (
        <Box
            sx={{
                color: '#1D1D1F',
                lineHeight: 1.5,
                fontWeight: 400,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                letterSpacing: '-0.011em',
                fontSize: isMobile ? '1rem' : '1.1rem',
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                    color: '#1D1D1F',
                    fontWeight: 600,
                    marginBottom: '1rem',
                    marginTop: '1rem',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    letterSpacing: '-0.02em',
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
                            sx={{ mb: 1.5, color: 'inherit', lineHeight: 1.5 }}
                        >
                            {children}
                        </Typography>
                    ),
                    h1: ({ children }) => (
                        <Typography variant={isMobile ? 'h6' : 'h4'} component="h1" sx={{ mb: 1.5, color: 'inherit', fontWeight: 600 }}>
                            {children}
                        </Typography>
                    ),
                    h2: ({ children }) => (
                        <Typography variant={isMobile ? 'subtitle1' : 'h5'} component="h2" sx={{ mb: 1.5, color: 'inherit', fontWeight: 600 }}>
                            {children}
                        </Typography>
                    ),
                    h3: ({ children }) => (
                        <Typography variant={isMobile ? 'subtitle2' : 'h6'} component="h3" sx={{ mb: 1, color: 'inherit', fontWeight: 600 }}>
                            {children}
                        </Typography>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </Box>
    );

    const ImageContent = () => (
        <>
            {props.imageUrl && (
                <Fade in={imageLoaded} timeout={600}>
                    <Box
                        sx={{
                            maxWidth: '100%',
                            maxHeight: '70%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
                        }}
                    >
                        <img
                            src={props.imageUrl}
                            alt="Split slide image"
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
                        width: { xs: 150, md: 250 },
                        height: { xs: 100, md: 180 },
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
                        sx={{ color: 'rgba(0, 0, 0, 0.4)', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                    >
                        Loading...
                    </Typography>
                </Box>
            )}
        </>
    );

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

            <Fade
                in={true}
                timeout={600}
                style={{ transitionDelay: '200ms' }}
            >
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'stretch' }}>
                    <Grid container spacing={3} sx={{ height: '100%' }}>
                        <Grid item xs={12} md={6}>
                            <ContentBox isImageSide={props.imagePosition === 'left'}>
                                {props.imageUrl && props.imagePosition === 'left' ? (
                                    <ImageContent />
                                ) : (
                                    <TextContent content={props.leftContent} />
                                )}
                            </ContentBox>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <ContentBox isImageSide={props.imagePosition === 'right'}>
                                {props.imageUrl && props.imagePosition === 'right' ? (
                                    <ImageContent />
                                ) : (
                                    <TextContent content={props.rightContent} />
                                )}
                            </ContentBox>
                        </Grid>
                    </Grid>
                </Box>
            </Fade>
        </Container>
    );
}

export default SplitSlide; 
