import { Box, Container, Grid, List, ListItem, ListItemIcon, ListItemText, Typography, Fade } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { useEffect, useState } from 'react';
import useIsMobile from '../hooks/useIsMobile';

interface Props {
    title: string;
    leftTitle: string;
    rightTitle: string;
    leftItems: string[];
    rightItems: string[];
}

function ComparisonSlide(props: Props) {
    const isMobile = useIsMobile();
    const [visibleItems, setVisibleItems] = useState<number>(0);

    useEffect(() => {
        // Reset animation when slide changes
        setVisibleItems(0);
        
        // Staggered entrance animation
        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                setVisibleItems(prev => {
                    const maxItems = Math.max(props.leftItems.length, props.rightItems.length);
                    if (prev < maxItems) {
                        return prev + 1;
                    }
                    clearInterval(interval);
                    return prev;
                });
            }, 100);
            return () => clearInterval(interval);
        }, 400);
        
        return () => clearTimeout(timer);
    }, [props.leftItems, props.rightItems]);

    const ComparisonColumn = ({
        title,
        items,
        isLeft
    }: {
        title: string;
        items: string[];
        isLeft: boolean;
    }) => (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                p: { xs: 3, md: 4 },
                backgroundColor: 'rgba(250, 250, 250, 0.6)',
                borderRadius: 3,
                border: '1px solid rgba(0, 0, 0, 0.06)',
                height: '100%',
                transition: 'transform 0.3s ease-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.06)'
                }
            }}
        >
            <Typography
                variant={isMobile ? 'h5' : 'h4'}
                sx={{
                    color: isLeft ? '#007AFF' : '#8E8E93',
                    fontWeight: 600,
                    mb: { xs: 2.5, md: 3.5 },
                    textAlign: 'left',
                    letterSpacing: '-0.02em',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}
            >
                {title}
            </Typography>

            <List sx={{ py: 0, width: '100%' }}>
                {items.map((item, index) => (
                    <Fade 
                        key={index} 
                        in={index < visibleItems}
                        timeout={400}
                        style={{ 
                            transitionDelay: `${index * 80}ms`,
                            transformOrigin: isLeft ? 'left' : 'right' 
                        }}
                    >
                        <ListItem
                            sx={{
                                py: { xs: 1.25, md: 1.75 },
                                px: 0.5,
                                alignItems: 'flex-start',
                                borderBottom: index < items.length - 1 ? '1px solid rgba(0, 0, 0, 0.06)' : 'none',
                                '&:last-child': {
                                    pb: 0.5
                                }
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 36,
                                    mt: 0.25,
                                }}
                            >
                                {isLeft ? (
                                    <Add
                                        sx={{
                                            color: '#007AFF',
                                            fontSize: { xs: 20, md: 22 },
                                        }}
                                    />
                                ) : (
                                    <Remove
                                        sx={{
                                            color: '#8E8E93',
                                            fontSize: { xs: 20, md: 22 },
                                        }}
                                    />
                                )}
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Box>
                                        <ReactMarkdown
                                            components={{
                                                p: ({ children }) => (
                                                    <Typography
                                                        variant="body1"
                                                        component="p"
                                                        sx={{
                                                            color: '#1D1D1F',
                                                            lineHeight: 1.5,
                                                            fontWeight: 400,
                                                            fontSize: { xs: '0.95rem', md: '1.05rem' },
                                                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                                                            letterSpacing: '-0.01em',
                                                            m: 0
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
                                            }}
                                        >
                                            {item}
                                        </ReactMarkdown>
                                    </Box>
                                }
                            />
                        </ListItem>
                    </Fade>
                ))}
            </List>
        </Box>
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
                        mb: { xs: 5, md: 8 },
                        textAlign: 'center',
                        letterSpacing: '-0.025em',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}
                >
                    {props.title}
                </Typography>
            </Fade>

            <Box sx={{ flex: 1, width: '100%' }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <ComparisonColumn
                            title={props.leftTitle}
                            items={props.leftItems}
                            isLeft={true}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ComparisonColumn
                            title={props.rightTitle}
                            items={props.rightItems}
                            isLeft={false}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default ComparisonSlide; 
