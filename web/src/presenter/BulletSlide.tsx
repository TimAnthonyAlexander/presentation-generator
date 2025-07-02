import { Box, Container, Fade, Typography } from '@mui/material';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { useEffect, useState } from 'react';
import useIsMobile from '../hooks/useIsMobile';
import { BetterBullet } from './slideinterfaces';

interface Props {
    title: string;
    bullets: BetterBullet[];
}

function BulletSlide(props: Props) {
    const isMobile = useIsMobile();
    const [visibleBullets, setVisibleBullets] = useState<number>(0);

    useEffect(() => {
        // Reset animation when slide changes
        setVisibleBullets(0);

        // Staggered animation with precise timing
        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                setVisibleBullets(prev => {
                    if (prev < props.bullets.length) {
                        return prev + 1;
                    }
                    clearInterval(interval);
                    return prev;
                });
            }, 100);

            return () => clearInterval(interval);
        }, 300);

        return () => clearTimeout(timer);
    }, [props.bullets.length]);

    // Clean up bullet text
    const cleanBulletText = (text: string) => {
        if (text.endsWith('.')) {
            return text.slice(0, -1);
        }
        return text;
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                p: { xs: 4, md: 8 },
                boxSizing: 'border-box',
                justifyContent: 'flex-start',
                pt: { xs: 6, md: 10 },
                color: '#1D1D1F',
            }}
        >
            <Fade in={true} timeout={400}>
                <Typography
                    variant={isMobile ? 'h4' : 'h2'}
                    sx={{
                        color: '#1D1D1F',
                        fontWeight: 600,
                        mb: { xs: 4, md: 6 },
                        textAlign: 'left',
                        letterSpacing: '-0.025em',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}
                >
                    {props.title}
                </Typography>
            </Fade>

            {props.bullets && props.bullets.length > 0 &&
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 2.5, md: 3.5 },
                        maxWidth: '100%',
                        mt: 2,
                    }}
                >
                    {props.bullets?.map((betterBullet, index) => (
                        <Fade
                            key={index}
                            in={index < visibleBullets}
                            timeout={350}
                            style={{
                                transitionDelay: `${index * 60}ms`,
                                transitionTimingFunction: 'cubic-bezier(0.2, 0, 0.2, 1)',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    pl: betterBullet.indent ? betterBullet.indent * 2.5 : 0,
                                    position: 'relative',
                                    '&::before': {
                                        content: '""',
                                        width: '5px',
                                        height: '5px',
                                        borderRadius: '50%',
                                        backgroundColor: '#007AFF',
                                        position: 'absolute',
                                        left: betterBullet.indent ? betterBullet.indent * 2.5 - 16 : -16,
                                        top: '0.65em',
                                    }
                                }}
                            >
                                <Box sx={{ ml: 0 }}>
                                    <ReactMarkdown
                                        components={{
                                            p: ({ children }) => (
                                                <Typography
                                                    variant={isMobile ? 'body1' : 'h6'} 
                                                    sx={{
                                                        color: '#1D1D1F',
                                                        lineHeight: 1.4,
                                                        fontWeight: 400,
                                                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                                                        letterSpacing: '-0.011em',
                                                        fontSize: isMobile ? 
                                                            (props.bullets.length > 6 ? '0.95rem' : '1.05rem') : 
                                                            (props.bullets.length > 8 ? '1.05rem' : '1.15rem'),
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
                                        {cleanBulletText(betterBullet.text)}
                                    </ReactMarkdown>
                                </Box>
                            </Box>
                        </Fade>
                    ))}
                </Box>
            }
        </Container>
    );
}

export default BulletSlide;
