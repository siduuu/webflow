// libs
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);
// modules
import {Transition} from "modules/transition/Transition"
// import {Overlay} from "modules/overlay"
import {webgl, overlay, lenis, redeclare} from "modules/constants"

import {isTouch} from "modules/utils"



let interval;
const transition = new Transition();
window.addEventListener("DOMContentLoaded", () => {

    let themeUrl = document.body.dataset.themeurl;
    let step = 0;
    setInterval(() => {
        step = (step + 1) % 65;
        const url = themeUrl + '/img/favicons/favicon' + step + '.png';
        document.querySelector('link[rel=icon]').setAttribute('href', url)
    }, 150)

    window.addEventListener("resize", onresize());

	transition.start(window.location.href);

    // const overlay = new Overlay();
	
	document.addEventListener('click', function (event) {
		if (event.target.closest('a') && !event.target.closest('a[target="_blank"]') && !event.target.closest('a').classList.contains('mailTo')) {

            document.querySelector('nav').classList.add('off');
            gsap.delayedCall(0.1, () => {
                document.querySelector('nav').classList.remove('off');
            })

            if(event.target.closest('a[hreflang]')){
                document.body.classList.add('changeLang')
            }
            

            if(event.target.closest('a').classList.contains('toSingle')){
                document.body.classList.add('toSingleTransition')
            }else if(event.target.closest('a').getAttribute('href').indexOf("projets") > -1) {
                document.body.classList.add('toSingle')
            }

			const elDom = event.target.closest('a');
            event.preventDefault();
            
            if(
                event.target.closest('a').classList.contains('toK') 
                && document.body.classList.contains('home')
            ){
                if(lenis !== null){
                    lenis.scrollTo(0)
                }else {
                    const progress = {}
                    progress.dist = window.pageYOffset;
                    gsap.to(progress, {
                        dist: 0,
                        ease:'power3.inOut',
                        duration:1.6,
                        onUpdate: () => {
                            window.scrollTo(0,progress.dist);
                        }
                    })
                }
            }else if(
                event.target.closest('a').classList.contains('toActivePro') 
                && document.body.classList.contains('home')
            ){
                const progress = {}
                progress.dist = window.pageYOffset;
                gsap.to(progress, {
                    dist: (document.querySelector('.premiersBlocs').getBoundingClientRect().top - 5) + window.pageYOffset,
                    ease:'power3.inOut',
                    duration:1.6,
                    onUpdate: () => {
                        window.scrollTo(0,progress.dist);
                    }
                })

                if(window.innerWidth <= 900){
                    closeMenuMob()
                }
            }else if(
                event.target.closest('a').classList.contains('toPastPro') 
                && document.body.classList.contains('home')
            ){
                const progress = {}
                progress.dist = window.pageYOffset;
                gsap.to(progress, {
                    dist: (document.querySelector('.pastPro').getBoundingClientRect().top - 5) + window.pageYOffset,
                    ease:'power3.inOut',
                    duration:1.6,
                    onUpdate: () => {
                        window.scrollTo(0,progress.dist);
                    }
                })

                if(window.innerWidth <= 900){
                    closeMenuMob()
                }
            }else if(!transition.animEnCours){
                if(event.target.closest('a').classList.contains('toActivePro')){
                    document.querySelector('html').classList.add('toActivePro')
                }else if(event.target.closest('a').classList.contains('toPastPro')){
                    document.querySelector('html').classList.add('toPastPro')
                } 

                transition.start(elDom.getAttribute('href'), event.target);
                history.pushState({}, '', elDom.getAttribute('href'));
	        }
            
        }else if (event.target.closest('.toMenu')) {
        	gsap.to('.inner-nav', {
                x: '0px',
                ease:'power4.inOut',
                duration:0.5
            })

            gsap.to('.innerK', {
                x:"100%",
                ease:'power4.inOut',
                duration:0.5
            })
            gsap.to('.toMenu', {
                autoAlpha:0,
                duration:0.5,
                ease:'power4.inOut',
            })
            
        
        }else if (event.target.closest('.toOverlay') && !document.querySelector('.overlay.actif')){
            //document.body.classList.add('hidden')
            
            if(lenis !== null){
                lenis.stop()
                lenis.destroy()
            }

            if(window.innerWidth <= 900 && document.body.classList.contains('hidden')){
                closeMenuMob()
            }


            if(event.target.closest('.toPartager')){
                document.querySelector('.o-share').classList.add('actif')
            }else if(event.target.closest('.toIdea')){
                document.querySelector('.o-idea').classList.add('actif')
            }else if(event.target.closest('.toHelp')){
                document.querySelector('.o-help').classList.add('actif')
            }else if(event.target.closest('.toDonation')){
                document.querySelector('.o-donation').classList.add('actif')
            }else if(event.target.closest('.toContact')){
                document.querySelector('.o-contact').classList.add('actif')

            // members
            }else if(event.target.closest('.toMember')){
                document.querySelectorAll('.o-member')[event.target.closest('.toMember').getAttribute('data-num')].classList.add('actif')
            // manifesto
            }else if(event.target.closest('.toManifesto')){
                document.querySelector('.o-manifesto').classList.add('actif')
            }


            gsap.set('.overlay.actif .content', {x:'0%'})
            if(document.querySelector('.overlay.actif .merci')){
                gsap.set('.overlay.actif .merci', {x:'100%'})
            }

            overlay.init()

            resetForm()

            // ICICIC
            //document.querySelector('.overlay.actif .droite').style.overflow = "hidden"
            document.body.classList.add('hidden')
            gsap.to('.overlay.actif, .overlay.actif .innerOver, .overlayBlur', {
                y:'0%',
                ease:'power4.inOut',
                duration:1,
                onComplete:() => {
                    // document.body.classList.add('hidden')
                    // document.querySelector('.overlay.actif .droite').setAttribute('style', '')
                }
            })   

        }else if(event.target.closest('.toBack')){
            nouveauMessage();
            clearInterval(interval)

        }else if(event.target.closest('.toMenuMob') && !event.target.closest('.toMenuMob').classList.contains('closeMob')){

            gsap.to('.toMenuMob .r', {
                duration:0.4,
                opacity:0
            })
            gsap.to('.toMenuMob .a', {
                duration:0.4,
                opacity:1,
                delay:0.6
            })

            document.body.classList.add('hidden')
            document.body.style.height = window.innerHeight + 'px'

            document.body.setAttribute('data-width-btn', document.querySelector('.toMenuMob').clientWidth);

            document.querySelector('.inner-nav .droite').classList.add('actif')

            // document.querySelector('.navMob .toK').style.display = "none";
            gsap.to('.navMob .toK', {
                autoAlpha:0,
                duration:0.2,
                onComplete:() => {
                    document.querySelector('.navMob .toK').style.display = "none";
                }
            })
            gsap.fromTo('.poly', {
                opacity:0
            },{
                opacity:1,
                delay:0.8,
                duration:0.2
            })


            gsap.to('.toMenuMob', {
                width: window.innerWidth - (document.querySelector('.lang-item:not(.current-lang) a').clientWidth + 10 + 10 + 5) + 'px',
                ease:'power4.inOut',
                duration:1,
                onComplete:() => {
                    document.querySelector('.toMenuMob').classList.add('closeMob')
                }
            })

            // gsap.to('.innerUl, .nav', {
            //     y:'0%',
            //     ease:'power4.inOut',
            //     duration:1
            // })

            gsap.to('.inner-nav', {
                "clip-path": "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                ease:'power4.inOut',
                duration:1
            })

        }else if(event.target.closest('.closeMob')){

            closeMenuMob();

            gsap.to('.toMenuMob .a', {
                duration:0.4,
                opacity:0
            })
            gsap.to('.toMenuMob .r', {
                duration:0.4,
                opacity:1,
                delay:0.6
            })

        // MISSIONS
        //
        }else if(event.target.closest('.toCA')){
            const progress = {}
            progress.scroll = window.pageYOffset

            gsap.to(progress, {
                scroll: document.querySelector('.m-champsMorph').getBoundingClientRect().top + window.pageYOffset - 58,
                ease: 'power4.inOut',
                duration: 1.4,
                onUpdate: () => {
                    window.scrollTo(0, progress.scroll)
                }
            })
        }else if(event.target.closest('.toMani')){
            const progress = {}
            progress.scroll = window.pageYOffset

            gsap.to(progress, {
                scroll: document.querySelector('.m-manifesto').getBoundingClientRect().top + window.pageYOffset - 5,
                ease: 'power4.inOut',
                duration: 1.4,
                onUpdate: () => {
                    window.scrollTo(0, progress.scroll)
                }
            })
        }else if(event.target.closest('.toBoard')){
            const progress = {}
            progress.scroll = window.pageYOffset

            gsap.to(progress, {
                scroll: document.querySelector('.h-more').getBoundingClientRect().top + window.pageYOffset,
                ease: 'power4.inOut',
                duration: 1.4,
                onUpdate: () => {
                    window.scrollTo(0, progress.scroll)
                }
            })
        }else if(event.target.closest('.toPaypal')){
            document.querySelector('form[target=_blank]').submit();
        }

        // FIN MISSIONS

        //
        // partie faux select
        //
        if(event.target.closest('.innerSelect') && !isTouch()) {
            document.querySelectorAll('.innerSelect').forEach(el => {el.classList.remove('devant')})
            event.target.closest('.innerSelect').classList.add('devant');
            document.querySelectorAll('.fauxSelect').forEach(el => {el.classList.remove('actif')})
            event.target.closest('.innerSelect').querySelector('.fauxSelect').classList.add('actif');
        }
        if(event.target.closest('.uneOption')) {
            event.target.closest('.uneOption').parentElement.classList.remove('actif');
            document.querySelectorAll('.innerSelect').forEach(el => {el.classList.remove('devant')})
            event.target.closest('.uneOption').parentElement.parentElement.querySelector('select').value = event.target.closest('.uneOption').getAttribute('data-value');
            //console.log(event.target.closest('.uneOption').parentElement.parentElement.querySelector('select').value, "oooo")
            // document.querySelector('.innerSelect2').classList.remove('off')
        }
        if(!event.target.closest('.innerSelect') && document.querySelector('.fauxSelect.actif')) {
            document.querySelectorAll('.fauxSelect').forEach(el => {el.classList.remove('actif')})
            document.querySelectorAll('.innerSelect').forEach(el => {el.classList.remove('devant')})
        }
        //
        // fin partie faux select
        //


        // pas dans un else car on peut à la foi cliquer sur un lien et fermer la modale
        if (event.target.closest('.closeBtn')){
            
            clearInterval(interval)

            
            if(lenis !== null){
                redeclare()
            }

            gsap.to('.overlay.actif, .overlayBlur', {
                y:'100%',
                ease:'power4.inOut',
                duration:1,
                onComplete: () => {
                    document.body.classList.remove('hidden')
                }
            })
            gsap.to('.overlay.actif .innerOver', {
                y:'-90%',
                ease:'power4.inOut',
                duration:1,
                onComplete:() => {
                    overlay.killOverlay()
                    document.querySelector('.overlay.actif').classList.remove('actif')
                }
            })
        }
    })

    // document.querySelectorAll('.toSousMenu').forEach(btn => {
    //     console.log('iiii')
    //     btn.addEventListener('mouseenter', () => {
    //         console.log('iii')
    //     })
    //     btn.addEventListener('click', () => {
    //         console.log('iii')
    //     })
    // })

    //
    // forms soumission
    //
    document.addEventListener('submit', function (event) {
        if (event.target.closest('form')){
            if(event.target.closest('form').classList.contains('formIdea')){
                event.preventDefault();
                const el = event.target;

                let formData;
                formData =  'c_name='+encodeURIComponent(el.querySelector('input[name="name"]').value);
                formData += '&c_email='+encodeURIComponent(el.querySelector('input[name="email"]').value);
                formData += '&c_foundation='+encodeURIComponent(el.querySelector('input[name="foundation"]').value);
                formData += '&c_message='+encodeURIComponent(el.querySelector('textarea').value);

                const request = new XMLHttpRequest();
                request.open('GET', '?alrightIdea&' + formData, true);
                request.onload = () => { 
                    if(request.status >= 200 && request.status < 400){
                        messageEnvoye();
                    }
                }
                request.send();
                return false;
            }
            if(event.target.closest('form').classList.contains('formHelp')){
                event.preventDefault();
                const el = event.target;

                let formData;
                formData =  'c_name='+encodeURIComponent(el.querySelector('input[name="name"]').value);
                formData += '&c_email='+encodeURIComponent(el.querySelector('input[name="email"]').value);
                formData += '&c_project='+encodeURIComponent(el.querySelector('select[name="choisirProjet"]').options[el.querySelector('select[name="choisirProjet"]').selectedIndex].text);
                formData += '&c_message='+encodeURIComponent(el.querySelector('textarea').value);

                const request = new XMLHttpRequest();
                request.open('GET', '?alrightHelp&' + formData, true);
                request.onload = () => { 
                    if(request.status >= 200 && request.status < 400){
                        messageEnvoye();
                    }
                }
                request.send();
                return false;
            }
            if(event.target.closest('form').classList.contains('formContact')){
                event.preventDefault();
                const el = event.target;

                let formData;
                formData =  'c_name='+encodeURIComponent(el.querySelector('input[name="name"]').value);
                formData += '&c_email='+encodeURIComponent(el.querySelector('input[name="email"]').value);
                formData += '&c_message='+encodeURIComponent(el.querySelector('textarea').value);

                const request = new XMLHttpRequest();
                request.open('GET', '?alrightContact&' + formData, true);
                request.onload = () => { 
                    if(request.status >= 200 && request.status < 400){
                        messageEnvoye();
                    }
                }
                request.send();
                return false;
            }
        }
    })

    // document.getElementById('formIdea').addEventListener('submit', (event) => {
    //     event.preventDefault();
    //     const el = event.target;

    //     let formData;
    //     formData =  'c_name='+encodeURIComponent(el.querySelector('input[name="name"]').value);
    //     formData += '&c_email='+encodeURIComponent(el.querySelector('input[name="email"]').value);
    //     formData += '&c_foundation='+encodeURIComponent(el.querySelector('input[name="foundation"]').value);
    //     formData += '&c_message='+encodeURIComponent(el.querySelector('textarea').value);

    //     const request = new XMLHttpRequest();
    //     request.open('GET', '?alrightIdea&' + formData, true);
    //     request.onload = () => { 
    //         if(request.status >= 200 && request.status < 400){
    //             messageEnvoye();
    //         }
    //     }
    //     request.send();
    //     return false;
    // });
    // document.getElementById('formHelp').addEventListener('submit', (event) => {
    //     event.preventDefault();
    //     const el = event.target;

    //     let formData;
    //     formData =  'c_name='+encodeURIComponent(el.querySelector('input[name="name"]').value);
    //     formData += '&c_email='+encodeURIComponent(el.querySelector('input[name="email"]').value);
    //     formData += '&c_project='+encodeURIComponent(el.querySelector('select[name="choisirProjet"]').options[el.querySelector('select[name="choisirProjet"]').selectedIndex].text);
    //     formData += '&c_message='+encodeURIComponent(el.querySelector('textarea').value);

    //     const request = new XMLHttpRequest();
    //     request.open('GET', '?alrightHelp&' + formData, true);
    //     request.onload = () => { 
    //         if(request.status >= 200 && request.status < 400){
    //             messageEnvoye();
    //         }
    //     }
    //     request.send();
    //     return false;
    // });
    // document.getElementById('formContact').addEventListener('submit', (event) => {
    //     event.preventDefault();
    //     const el = event.target;

    //     let formData;
    //     formData =  'c_name='+encodeURIComponent(el.querySelector('input[name="name"]').value);
    //     formData += '&c_email='+encodeURIComponent(el.querySelector('input[name="email"]').value);
    //     formData += '&c_message='+encodeURIComponent(el.querySelector('textarea').value);

    //     const request = new XMLHttpRequest();
    //     request.open('GET', '?alrightContact&' + formData, true);
    //     request.onload = () => { 
    //         if(request.status >= 200 && request.status < 400){
    //             messageEnvoye();
    //         }
    //     }
    //     request.send();
    //     return false;
    // });
    
    //
    // fin forms soumission
    //




    // intersection observer
    //const elmt = document.body;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(window.innerWidth > 900){
                if(entry.isIntersecting){
                    gsap.to('.inner-nav', {
                        x: '0px',
                        ease:'power4.inOut',
                        duration:0.5
                    })

                    gsap.to('.innerK', {
                        x:"100%",
                        ease:'power4.inOut',
                        duration:0.5
                    })
                    gsap.to('.toMenu', {
                        autoAlpha:0,
                        duration:0.5,
                        ease:'power4.inOut',
                    })

                    // if(document.body.classList.contains('home')){
                    //     gsap.to('.toKDesk', {
                    //         autoAlpha:0,
                    //         duration:0.5,
                    //         ease:'power4.inOut',
                    //     })
                    // }
                }else{
                    gsap.to('.inner-nav', {
                        x: document.querySelector('.inner-nav .droite').clientWidth + 'px',
                        ease:'power4.inOut',
                        duration:0.5
                    })

                    gsap.to('.innerK', {
                        x:"0%",
                        ease:'power4.inOut',
                        duration:0.5
                    })
                    gsap.to('.toMenu', {
                        autoAlpha:1,
                        duration:0.5,
                        ease:'power4.inOut',
                    })

                    // if(document.body.classList.contains('home')){
                    //     gsap.to('.toKDesk', {
                    //         autoAlpha:1,
                    //         duration:0.5,
                    //         ease:'power4.inOut',
                    //     })
                    // }
                }
            }
        })
    })

    observer.observe(document.querySelector('.intersectionOb'))

    
})

window.addEventListener('popstate', (e) => {

    if(window.location.href.indexOf("projets") > -1) {
        document.body.classList.add('toSingle')
    }

    transition.start(location.href, document.body);
}, false);
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

// temp
// document.addEventListener('keydown', (e) => {
// 	if(e.keyCode == 32){
//         document.body.classList.toggle('dev')
//     }
// });


//
// functions close MENU MOB
//
function closeMenuMob() {
    document.body.classList.remove('hidden')
    document.body.style.height = 'auto'

    gsap.to('.toMenuMob .a', {
        duration:0.4,
        opacity:0
    })
    gsap.to('.toMenuMob .r', {
        duration:0.4,
        opacity:1,
        delay:0.6
    })

    gsap.to('.toMenuMob', {
        width: document.body.getAttribute('data-width-btn') + 'px',
        ease:'power4.inOut',
        duration:1,
        onComplete:() => {
            document.querySelector('.inner-nav .droite').classList.remove('actif')
            //if(!document.querySelector('.home')){
                document.querySelector('.navMob .toK').style.display = "flex";
                gsap.to('.navMob .toK', {
                    autoAlpha:1,
                    duration:0.2
                })
            //}
            document.querySelector('.toMenuMob').classList.remove('closeMob')
        }
    })

    gsap.to('.inner-nav', {
        "clip-path": "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        ease:'power4.inOut',
        duration:1
    })
    gsap.to('.poly', {
        opacity:0,
        duration:0.2
    })
}











//
// functions pop ups
//
function messageEnvoye() {
    document.querySelector('.overlay.actif .droite').classList.add('off')
    gsap.to('.overlay.actif .content', {
        x:'-100%',
        ease:'power4.inOut',
        duration:1
    })
    gsap.to('.overlay.actif .merci', {
        x:'0%',
        ease:'power4.inOut',
        duration:1
    })

    etoiles();
}

function nouveauMessage() {
    resetForm()

    gsap.to('.overlay.actif .content', {
        x:'0%',
        ease:'power4.inOut',
        duration:1
    })
    gsap.to('.overlay.actif .merci', {
        x:'100%',
        ease:'power4.inOut',
        duration:1
    })
}

function resetForm() {
    document.querySelector('.overlay.actif .droite').scrollTo(0,0)
    document.querySelector('.overlay.actif .droite').classList.remove('off')
    document.querySelector('.overlay.actif form')?.reset()

    document.querySelector('.innerSelect2') && document.querySelector('.innerSelect2').classList.add('off')

}


function etoiles() {
    interval = setInterval(() => {
        const img = document.createElement('img');
        img.src = document.body.getAttribute('data-directory') + '/img/star.svg';

        const el = document.querySelector('.overlay.actif .gauche')
        el.appendChild(img);

        const randX = Math.random() * el.clientWidth;
        const randY = Math.random() * el.clientHeight;
        
        gsap.fromTo(img, {
            rotate: Math.random() * 360 * (Math.round(Math.random()) * 2 - 1),
            x: randX + 'px',
            y: (randY - 200) + 'px',
            scale:0.5
        },{
            rotate: 0,
            y: randY + 'px',
            duration:1.5,
            scale:1,
            ease:'elastic.out(0.8, 0.35)',
            onComplete: () => {
                gsap.to(img, {
                    opacity:0,
                    duration:0.2,
                    delay:0.4,
                    onComplete:() => {
                        img.remove();
                    }
                })
            }
        })

    }, 150)
}
//
// fin functions pop ups
//


function onresize(){
    // hack scrollbar 100vw
    const wW = window.innerWidth
    const scrollbarW = Math.max(wW - document.documentElement.clientWidth, 0)
    document.documentElement.style.setProperty(
        '--scrollbar-width',
        `${scrollbarW}px`
    )
}