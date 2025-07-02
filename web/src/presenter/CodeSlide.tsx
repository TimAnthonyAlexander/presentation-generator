import { Box, Chip, Container, Fade, Typography } from '@mui/material';
import { CodeRounded } from '@mui/icons-material';
import useIsMobile from '../hooks/useIsMobile';

interface Props {
    title: string;
    code: string;
    language?: string;
    filename?: string;
}

function CodeSlide(props: Props) {
    const isMobile = useIsMobile();

    const getLanguageColor = (lang?: string) => {
        const colors: { [key: string]: string } = {
            javascript: '#F7DF1E',
            typescript: '#3178C6',
            python: '#3776AB',
            java: '#ED8B00',
            cpp: '#00599C',
            html: '#E34F26',
            css: '#1572B6',
            react: '#61DAFB',
            vue: '#4FC08D',
            angular: '#DD0031',
        };
        return colors[lang?.toLowerCase() || ''] || '#8E8E93';
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
                    variant={isMobile ? 'h5' : 'h3'}
                    sx={{
                        color: '#1D1D1F',
                        fontWeight: 600,
                        mb: { xs: 3, md: 5 },
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
                timeout={600}
                style={{ transitionDelay: '200ms' }}
            >
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'rgba(0, 0, 0, 0.03)',
                        borderRadius: 2,
                        border: '1px solid rgba(0, 0, 0, 0.07)',
                        overflow: 'hidden',
                        maxHeight: '75%',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                    }}
                >
                    {/* Code header */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2,
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.07)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CodeRounded sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: 18 }} />
                            {props.filename && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'rgba(0, 0, 0, 0.8)',
                                        fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                                        fontWeight: 500,
                                        fontSize: '0.85rem',
                                    }}
                                >
                                    {props.filename}
                                </Typography>
                            )}
                        </Box>

                        {props.language && (
                            <Chip
                                label={props.language.toUpperCase()}
                                size="small"
                                sx={{
                                    backgroundColor: getLanguageColor(props.language),
                                    color: props.language.toLowerCase() === 'javascript' ? '#000' : '#fff',
                                    fontWeight: 500,
                                    fontSize: '0.7rem',
                                    height: 20,
                                    '& .MuiChip-label': {
                                        px: 1,
                                    }
                                }}
                            />
                        )}
                    </Box>

                    {/* Code content */}
                    <Box
                        sx={{
                            flex: 1,
                            p: { xs: 2, md: 3 },
                            overflow: 'auto',
                            fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                            color: '#1D1D1F',
                            '&::-webkit-scrollbar': {
                                width: '8px',
                                height: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: 'rgba(0, 0, 0, 0.03)',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: 'rgba(0, 0, 0, 0.15)',
                                borderRadius: '4px',
                            },
                        }}
                    >
                        <pre
                            style={{
                                margin: 0,
                                padding: 0,
                                color: '#1D1D1F',
                                fontSize: isMobile ? '0.8rem' : '0.95rem',
                                lineHeight: 1.5,
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                            }}
                        >
                            <code>{props.code}</code>
                        </pre>
                    </Box>
                </Box>
            </Fade>
        </Container>
    );
}

export default CodeSlide; 
