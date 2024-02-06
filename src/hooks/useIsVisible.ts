import { RefObject, useEffect, useMemo, useState } from "react"


/**
 * @param ref of the element to check for visibility
 * @returns true if element is visible, else false
 * 
 * @since 0.0.7
 */
export default function useIsVisible(ref: RefObject<HTMLElement>) {

    const [isIntersecting, setIntersecting] = useState(false)
  
    const observer = useMemo(() => new IntersectionObserver(
        ([entry]) => setIntersecting(entry.isIntersecting)
    ), [ref])
  
  
    useEffect(() => {
        observer.observe(ref.current!);

        return () => observer.disconnect();
    }, [])
  
    return isIntersecting
}