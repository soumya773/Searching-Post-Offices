const getStartedBtn = document.getElementById("get-started");
    const welcomeScreen = document.getElementById("welcome-screen");
    const resultScreen = document.getElementById("result-screen");

    let allPostOffices = [];

    getStartedBtn.addEventListener("click", async () => {
      welcomeScreen.classList.add("hidden");
      resultScreen.classList.remove("hidden");

      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        const ip = ipData.ip;
        document.getElementById("ip").textContent = ip;

        const detailsResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        const details = await detailsResponse.json();

        document.getElementById("city").textContent = details.city;
        document.getElementById("region").textContent = details.region;
        document.getElementById("org").textContent = details.org;
        document.getElementById("hostname").textContent = details.hostname || "-";
        document.getElementById("timezone").textContent = details.timezone;

        const mapDiv = document.getElementById("map-frame");
        mapDiv.innerHTML = `<iframe src="https://maps.google.com/maps?q=${details.latitude},${details.longitude}&z=15&output=embed"></iframe>`;

        const date = new Date().toLocaleString("en-US", { timeZone: details.timezone });
        document.getElementById("datetime").textContent = date;

        const pincode = details.postal;
        document.getElementById("pincode").textContent = pincode;

        const postOfficeRes = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const postOfficeData = await postOfficeRes.json();

        document.getElementById("message").textContent = postOfficeData[0].Message;

        allPostOffices = postOfficeData[0].PostOffice || [];
        displayPostOffices(allPostOffices);
      } catch (err) {
        console.error("Error:", err);
        alert("Something went wrong. Please try again later.");
      }
    });

    function displayPostOffices(offices) {
      const container = document.getElementById("post-offices");
      container.innerHTML = "";

      offices.forEach(office => {
        const card = document.createElement("div");
        card.className = "post-office-card";
        card.innerHTML = `
          <p><strong>Name:</strong> ${office.Name}</p>
          <p><strong>Branch Type:</strong> ${office.BranchType}</p>
          <p><strong>Delivery Status:</strong> ${office.DeliveryStatus}</p>
          <p><strong>District:</strong> ${office.District}</p>
          <p><strong>Division:</strong> ${office.Division}</p>
        `;
        container.appendChild(card);
      });
    }

    document.getElementById("search").addEventListener("input", (e) => {
      const value = e.target.value.toLowerCase();
      const filtered = allPostOffices.filter(o =>
        o.Name.toLowerCase().includes(value) ||
        o.BranchType.toLowerCase().includes(value)
      );
      displayPostOffices(filtered);
    });