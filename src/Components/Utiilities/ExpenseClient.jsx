import * as React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Dialog, DialogContent } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { MyContext } from '../../App';
function ExpenseClient() {
    //Mobile View
    const [isMobile, setIsMobile] = React.useState(false);
    React.useEffect(() => {
        if (window.innerWidth < 768) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        };
    }, [])
    //Swiper Slides
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const slidesData = [
        {
            id: 1,
            name: "Pat Titzer",
            rating: 5,
            company: "Program Manager",
            location: " Adelaide, Australia",
            testimonial:
                "Expense Tracker 365 is a great app with excellent support. The advanced features make it a complete tool & has really improved our expense tracking and reporting workflow.",
        },
        {
            id: 2,
            name: "Dan Schmidt",
            rating: 5,
            company: " Managing Director",
            location: "San Francisco, California, United States",
            testimonial:
                "Expense 365 has been a good experience so far with reliable support. The expense tracking workflow and approvals are simple and efficient, helping us track expenses in real time.",
        },
        {
            id: 3,
            name: "Joshua Cooling",
            rating: 5,
            company: "Data Analyst",
            location: "Muskegon, Michigan, United States",
            testimonial:
                "Expense 365 provides a reliable experience with responsive support that’s always available when needed. It allows us to track all our expenses in one place, making the overall process more organized and convenient.",
        },
        // {
        //     id: 8,
        //     name: "Sarah Mitchell ",
        //     rating: 5,
        //     company: "Head of Legal Operations  ",
        //     location: "United States ",
        //     testimonial:
        //         "Having all contracts stored in one place has made a big difference for our team. Instead of searching through emails and folders, we can quickly find the documents we need. CLM 365 gives us a centralized repository that makes contract tracking and access much easier. ",
        // },
    ];
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slidesData.length);
        }, 5000); // Move to the next slide every 2 seconds for a smoother effect
        return () => clearInterval(interval); // Clear interval on component unmount
    }, []);

    const visibleLogos = Array.from({ length: 3 }).map((_, i) =>
        slidesData[(currentIndex + i) % slidesData.length]
    );



    const [isOpen, setIsOpen] = React.useState(false);
    const isTruncated = true;
    const [currentSlide, setCurrentSlide] = React.useState();
    const toggleModal = () => setIsOpen(!isOpen);
    const handleClose = () => {
        setIsOpen(false);
    };

    function openModal(slide) {
        toggleModal();
        setCurrentSlide(slide);

    }

    return (
        <>
            <Swiper
                slidesPerView={isMobile ? 1 : 3}
                spaceBetween={30}
                scrollbar
                pagination={{ clickable: true }}
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                className="mySwiper"
            >
                {visibleLogos.map((slide) => {
                    const showLogo = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15,].includes(slide.id); // ✅ control by ID

                    return (
                        <SwiperSlide key={slide.id} className="swiperSlidestyles">
                            <div className="CardHeaderStyle">
                                <div>

                                    <div className='no-logo-placeholder'>{/* Optional fallback */}</div>

                                </div>
                                <div>
                                    <div className='outcustomercontent'>
                                        <span className="UserNameStyles">{slide.name}</span>
                                        <span className="elementor-testimonial__title">{slide.company}</span>
                                        <span className="elementor-testimonial__title">{slide.location}</span>
                                        <div className="elementor-star-rating">
                                            {[...Array(slide.rating)].map((_, i) => (
                                                <i key={i} className="elementor-star-full">★</i>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="elementor-testimonial__content">
                                        <div className="elementor-testimonial__text">
                                            {isTruncated
                                                ? `${slide.testimonial.slice(0, 100)}...`
                                                : slide.testimonial}
                                            {slide.testimonial.length > 100 && (
                                                <div>
                                                    <button onClick={() => openModal(slide)} className="read-more-btn">
                                                        Read More
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <span id="Integration-ET"></span>
                                        <span id="Integration-ET"></span>
                                        <span id="pricing-section"></span>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
            <Dialog
                open={isOpen}
                onClose={handleClose}
                maxWidth={"xl"}
                className="ClinetModal"
            >
                <DialogContent>

                    <div className="CardHeaderStyleModal">
                        <div className='flexEnd'>
                            <IoClose onClick={handleClose} />
                        </div>
                        <span className="UserNameStyles">{currentSlide?.name}</span>
                        <span className="elementor-testimonial__title">{currentSlide?.company}</span>
                        <span className="elementor-testimonial__title">{currentSlide?.location}</span>
                        <div className="elementor-star-rating">
                            {[...Array(currentSlide?.rating)].map((_, i) => (
                                <i key={i} className="elementor-star-full">★</i>
                            ))}
                        </div>
                        <div className="elementor-testimonial__content">
                            <div className="elementor-testimonial__text">
                                "{currentSlide?.testimonial}"
                            </div>
                        </div>
                    </div>
                    {/* <h2>{currentSlide?.name}</h2>
                    <p>{currentSlide?.testimonial}</p> */}
                    {/* <button onClick={toggleModal} className="close-btn">Close</button> */}
                </DialogContent>

            </Dialog>
        </>
    )
}

export default ExpenseClient;