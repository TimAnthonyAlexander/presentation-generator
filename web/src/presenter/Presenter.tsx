import { ArrowBackRounded, ArrowForwardRounded } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import BulletSlide from './BulletSlide';
import ImageSlide from './ImageSlide';
import CodeSlide from './CodeSlide';
import QuoteSlide from './QuoteSlide';
import SplitSlide from './SplitSlide';
import ComparisonSlide from './ComparisonSlide';
import { BulletContent, CodeContent, ComparisonContent, ImageContent, QuoteContent, Slide, SplitContent, TextContent, TitleContent } from './slideinterfaces';
import TextSlide from './TextSlide';
import TitleSlide from './TitleSlide';

interface Props {
    slides: Slide[];
    sx?: any;
    boxProps?: any;
}

function Presenter(props: Props) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const hasNextSlide = () => currentSlide < props.slides.length - 1;
    const hasPreviousSlide = () => currentSlide > 0;

    const nextSlide = () => {
        if (hasNextSlide() && !isTransitioning) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentSlide(currentSlide + 1);
                setIsTransitioning(false);
            }, 1200);
        }
    };

    const previousSlide = () => {
        if (hasPreviousSlide() && !isTransitioning) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentSlide(currentSlide - 1);
                setIsTransitioning(false);
            }, 1200);
        }
    };

    // Touch handling
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) { return; }

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        }
        if (isRightSwipe) {
            previousSlide();
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight' || event.key === ' ') {
                event.preventDefault();
                nextSlide();
            }
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                previousSlide();
            }
            if (event.key === 'Home') {
                event.preventDefault();
                if (!isTransitioning) {
                    setIsTransitioning(true);
                    setTimeout(() => {
                        setCurrentSlide(0);
                        setIsTransitioning(false);
                    }, 1200);
                }
            }
            if (event.key === 'End') {
                event.preventDefault();
                if (!isTransitioning) {
                    setIsTransitioning(true);
                    setTimeout(() => {
                        setCurrentSlide(props.slides.length - 1);
                        setIsTransitioning(false);
                    }, 1200);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlide, isTransitioning]);

    const progress = props.slides.length > 0 ? ((currentSlide + 1) / props.slides.length) * 100 : 0;

    const renderSlide = () => {
        const slide = props.slides[currentSlide];

        switch (slide.type) {
            case 'title':
                return (
                    <TitleSlide
                        title={slide.title}
                        subtitle={(slide.content as TitleContent)?.subtitle}
                    />
                );
            case 'bullet':
                return (
                    <BulletSlide
                        title={slide.title}
                        bullets={(slide.content as BulletContent).bullets}
                    />
                );
            case 'text':
                return (
                    <TextSlide
                        title={slide.title}
                        text={(slide.content as TextContent).text}
                        imageUrl={(slide.content as TextContent).imageUrl}
                        imagePosition={(slide.content as TextContent).imagePosition}
                        imageCaption={(slide.content as TextContent).imageCaption}
                        sources={(slide.content as TextContent).sources}
                    />
                );
            case 'image':
                return (
                    <ImageSlide
                        title={slide.title}
                        url={(slide.content as ImageContent).url}
                    />
                );
            case 'code':
                return (
                    <CodeSlide
                        title={slide.title}
                        code={(slide.content as CodeContent).code}
                        language={(slide.content as CodeContent).language}
                        filename={(slide.content as CodeContent).filename}
                    />
                );
            case 'quote':
                return (
                    <QuoteSlide
                        title={slide.title}
                        quote={(slide.content as QuoteContent).quote}
                        author={(slide.content as QuoteContent).author}
                        source={(slide.content as QuoteContent).source}
                    />
                );
            case 'split':
                return (
                    <SplitSlide
                        title={slide.title}
                        leftContent={(slide.content as SplitContent).leftContent}
                        rightContent={(slide.content as SplitContent).rightContent}
                        imageUrl={(slide.content as SplitContent).imageUrl}
                        imagePosition={(slide.content as SplitContent).imagePosition}
                    />
                );
            case 'comparison':
                return (
                    <ComparisonSlide
                        title={slide.title}
                        leftTitle={(slide.content as ComparisonContent).leftTitle}
                        rightTitle={(slide.content as ComparisonContent).rightTitle}
                        leftItems={(slide.content as ComparisonContent).leftItems}
                        rightItems={(slide.content as ComparisonContent).rightItems}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            {props.slides.length > 0 &&
                <Box
                    sx={{
                        width: '100svw',
                        height: '100svh',
                        position: 'absolute',
                        backgroundColor: '#fafafa',
                        color: '#1a1a1a',
                        overflow: 'hidden',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        ...props.sx,
                    }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    {...props.boxProps}
                >
                    {/* Minimal progress indicator */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '1px',
                            backgroundColor: '#e5e5e5',
                            zIndex: 1000,
                        }}
                    >
                        <Box
                            sx={{
                                height: '100%',
                                width: `${progress}%`,
                                backgroundColor: '#007aff',
                                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        />
                    </Box>

                    {/* Subtle navigation controls */}
                    {hasPreviousSlide() &&
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 48,
                                left: 48,
                                zIndex: 5000,
                            }}
                        >
                            <IconButton
                                onClick={previousSlide}
                                disabled={isTransitioning}
                                sx={{
                                    width: 44,
                                    height: 44,
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    color: '#1a1a1a',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                        transform: 'scale(1.05)',
                                    },
                                    '&:active': {
                                        transform: 'scale(0.95)',
                                    },
                                    '&:disabled': {
                                        color: 'rgba(26, 26, 26, 0.3)',
                                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                    }
                                }}
                            >
                                <ArrowBackRounded sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Box>
                    }

                    {hasNextSlide() &&
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 48,
                                right: 48,
                                zIndex: 5000,
                            }}
                        >
                            <IconButton
                                onClick={nextSlide}
                                disabled={isTransitioning}
                                sx={{
                                    width: 44,
                                    height: 44,
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    color: '#1a1a1a',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                        transform: 'scale(1.05)',
                                    },
                                    '&:active': {
                                        transform: 'scale(0.95)',
                                    },
                                    '&:disabled': {
                                        color: 'rgba(26, 26, 26, 0.3)',
                                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                    }
                                }}
                            >
                                <ArrowForwardRounded sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Box>
                    }

                    {/* Refined slide counter */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 48,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 5000,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#8e8e93',
                                fontSize: '13px',
                                fontWeight: 400,
                                letterSpacing: '0.08em',
                                lineHeight: 1,
                            }}
                        >
                            {String(currentSlide + 1).padStart(2, '0')} / {String(props.slides.length).padStart(2, '0')}
                        </Typography>
                    </Box>

                    {/* Slide content with smooth transitions */}
                    <Box
                        key={currentSlide}
                        sx={{
                            opacity: isTransitioning ? 0 : 1,
                            transform: isTransitioning ? 'translateY(8px)' : 'translateY(0)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {renderSlide()}
                    </Box>
                </Box>
            }
            {props.slides.length === 0 &&
                <Box
                    sx={{
                        width: '100svw',
                        height: '100svh',
                        position: 'relative',
                        backgroundColor: '#fafafa',
                        color: '#1a1a1a',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        ...props.sx,
                    }}
                >
                    <TitleSlide
                        title="No slides"
                    />
                </Box>
            }
        </>
    );
}

export default Presenter;
