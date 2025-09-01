export default function Footer(){

    return(

        <div className="bg-gray-700 text-center flex-col">
            <p className="m-5 text-white">This webapp was made with blood, sweat, and carbs, brought to you by Sadiq Shahid ❤️</p>

            <div className="flex justify-center gap-10 mb-4">

                <a href="https://github.com/Spherical-S">
                    <img src="/github64.png" alt="github" className="w-8 h-8"/>
                </a>

                <a href="https://linkedin.com/in/sadiqshahid/">
                    <img src="/linkedin64.png" alt="linkedin" className="w-8 h-8"/>
                </a>

                <a href="https://ko-fi.com/spherical">
                    <img src="/kofi64.png" alt="kofi" className="w-8 h-8"/>
                </a>

            </div>

        </div>

    );

}