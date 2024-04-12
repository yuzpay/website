const textSwapper = {
    selector: '.js-text-swap',
    words: [],
    counter: 0,
    elem: '',
    appearClass: 'appear',
    fadeClass: 'transparent',
    animationClass: 'move',
    swapInterval: 5000,
    fadeInterval: 1000,
    init: function () {
        this.elem = document.querySelector(this.selector);
        if (!this.elem) {
            return;
        }
        this.context = this;

        this.words = this.elem.dataset.text.split(',');

        let wordSwapInterval = setInterval(this._swapInterval.bind(this.context), this.swapInterval);

    },
    _swapInterval: function () {
        // swap out the words
        this._swapWords();

        // either increase the count or reset it to 0
        if (this.counter === this.words.length - 1) {
            this.counter = 0;
        } else {
            this.counter++;
        }

    },
    _swapWords: function () {
        this.elem.classList.remove(this.appearClass);
        this.elem.classList.add(this.animationClass);

        // fade out the old words
        this.elem.classList.add(this.fadeClass);

        // delay the fade-in for a bit
        let fadeDelay = setTimeout(this._fadeElem.bind(this.context), this.fadeInterval);
    },
    _fadeElem: function () {
        // swap the text
        this.elem.textContent = this.words[this.counter];

        // fade the words back in
        this.elem.classList.remove(this.animationClass);
        this.elem.classList.remove(this.fadeClass);
        this.elem.classList.add(this.appearClass);
    }
}

const faqToggler = {
    questionsClassName: 'js-get-answer',
    questionsSelector: '.js-get-answer',
    answerSelector: '.js-answer',
    answerVisibleClass: 'shown',
    blurClass: 'blur',
    questionVisibleClassName: 'faq-cloud-block-visible',
    fadeClass: 'transparent',
    stickyClass: 'stick',
    _shown: false,
    init: function () {
        let collection = document.querySelectorAll(this.questionsSelector);
        let answer = document.querySelector(this.answerSelector);
        if (!collection.length || !answer) {
            return;
        }
        let context = this;
        this.collection = collection;
        this.answer = answer;

        collection.forEach(function (item) {
            item.addEventListener('click', context.click.bind(context));
        });

        window.addEventListener("click", context.answerClose.bind(context));
    },
    click: function (e) {
        if (!this.answer.classList.contains(this.answerVisibleClass)) {
            this._answerOpen(e.target);
        }

        this.answerClose(e);
    },
    _answerOpen: function (elem) {
        let answerText = elem.dataset.answer.trim();

        // Giving answer and its wrapper element blur classes
        elem.parentElement.parentElement.classList.add(this.blurClass);
        elem.classList.add(this.questionVisibleClassName);
        this.answer.nextElementSibling.children[1].classList.add(this.blurClass);

        this.answer.textContent = answerText;
        this.answer.classList.remove(this.fadeClass);
        this.answer.classList.add(this.answerVisibleClass);
        this.answer.parentElement.classList.add(this.stickyClass);

        this._shown = true;
    },
    answerClose: function (e) {
        if (e.target.classList.contains(this.questionsClassName)) {
            return;
        }

        if (!this._shown) {
            return;
        }

        let context = this;
        this.answer.classList.remove(this.answerVisibleClass);
        this.answer.nextElementSibling.children[1].classList.remove(context.blurClass);

        this.answer.classList.add(context.fadeClass);
        this.answer.parentElement.classList.remove(this.stickyClass);


        this.collection.forEach(function (item) {
            if (item.classList.contains(context.questionVisibleClassName)) {
                item.parentElement.parentElement.classList.remove(context.blurClass);
                item.classList.remove(context.questionVisibleClassName);
            }
        })
        this._shown = false;
    }
}

const gsapAnim = {
    init: function () {
        gsap.registerPlugin(ScrollTrigger);
        // this.setAppearAnimation();
        this.scrollSection();
    },

    setAppearAnimation: function () {
        const sc = document.querySelectorAll('.gsap-appear');
        sc.forEach(section => {
            gsap.fromTo(section.children, {y: '+=100', opacity: 0}, {
                y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: 'easeInOut', scrollTrigger: {
                    trigger: section,
                    start: 'top 20%',
                }
            });
        });
    },

    scrollSection: function () {
        const listEl = document.querySelector('.js-side-scroll');
        const slides = document.querySelectorAll('.js-side-scroll .slider-item');
        gsap.to(listEl, {
            scrollTrigger: {
                trigger: '#scroll',
                endTrigger: '.getapp',
                start: 'top top',
                snap: 0,
                end: `+=${listEl.clientWidth}`,
                scrub: true,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: self => {
                    // console.log("progress:", self.progress.toFixed(3), "direction:", self.direction, "velocity", self.getVelocity());

                    if (self.progress.toFixed(3) < 0.25) {
                        gsap.to(slides[0], {
                            opacity: 1
                        });
                        gsap.to(slides[1], {
                            opacity: 0
                        });
                        gsap.to(slides[2], {
                            opacity: 0
                        });
                    } else if (self.progress.toFixed(3) >= 0.25 && self.progress.toFixed(3) < 0.75) {
                        gsap.to(slides[0], {
                            opacity: 0
                        });
                        gsap.to(slides[1], {
                            opacity: 1
                        });
                        gsap.to(slides[2], {
                            opacity: 0
                        });
                    } else if (self.progress.toFixed(2) >= 0.75) {
                        gsap.to(slides[0], {
                            opacity: 0
                        });
                        gsap.to(slides[1], {
                            opacity: 0
                        });
                        gsap.to(slides[2], {
                            opacity: 1
                        });
                    }
                },
            },
        });

        // ScrollTrigger.create({
        //       trigger: "#scroll",
        //       start: "top top",
        //       endTrigger: ".getapp",
        //       end: "+=${listEl.clientWidth}",
        //       onUpdate: self => {
        //          console.log("progress:", self.progress.toFixed(3), "direction:", self.direction, "velocity", self.getVelocity());
        //     },
        //  });
    }
}
window.addEventListener('DOMContentLoaded', function () {
    textSwapper.init();
    faqToggler.init();
    gsapAnim.init();

    let burgerBtn = document.getElementById("js-burger-toggler");
    burgerBtn.addEventListener("click", function (e) {
        document.querySelector('header.site-header').classList.remove('overflow-x-hidden');
        burgerBtn.nextElementSibling.classList.toggle("menu-opened");
        let t = document.querySelector(".menu-opened .menu");
        t && (t.ontransitionend = function () {
            t.classList.toggle("activated")
        })
    }), window.addEventListener("click", function (e) {
        if(e.target != burgerBtn && e.target.parentNode != burgerBtn){
            burgerBtn.nextElementSibling.classList.remove("menu-opened");
            document.querySelector('header.site-header').classList.add('overflow-x-hidden');
        }
    });
});
