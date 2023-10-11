export default {
    mounted(el, binding) {
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.5,
        };
        const callback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0) {
                    binding.value();
                }
            });
        };
        const observer = new IntersectionObserver(callback, options);
        observer.observe(el);
    },
    name: 'intersection'
}