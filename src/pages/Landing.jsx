import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  useEffect(() => {
    // Ticker items
    const tickerItems = [
      { label: 'Requests Today', val: '145.3k' },
      { label: 'Redis Rate Limit', val: 'Sliding Window' },
      { label: 'Key Security', val: 'SHA-256 Hash' },
      { label: 'Gateway Latency', val: '<10ms overhead' },
      { label: 'Billing Engine', val: 'BullMQ + Razorpay' },
      { label: 'Success Rate', val: '99.2%' },
      { label: 'Stack', val: 'MERN + Redis' },
      { label: 'Deploy', val: 'Railway + Vercel' },
    ];

    const ticker = document.getElementById('ticker');
    if (ticker) {
      const makeItems = () => tickerItems.map(item =>
        `<div class="ticker-item"><span>${item.val}</span> <span class="ticker-sep">·</span> ${item.label}</div>`
      ).join('');
      ticker.innerHTML = makeItems() + makeItems();
    }

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal, .flow-step, .feature-card, .pricing-card, .chain-item, .cta-section h2, .cta-section p, .cta-actions').forEach(el => {
      observer.observe(el);
    });

    // Terminal Type Animation
    const lines = [
      document.getElementById('tl1'),
      document.getElementById('tl2'),
      document.getElementById('tl3'),
      document.getElementById('tl4'),
      document.getElementById('tl5'),
      document.getElementById('tl6'),
      document.getElementById('tl7'),
      document.getElementById('tl8'),
    ];

    const termBody = document.getElementById('terminalBody');
    if (termBody) {
      const termObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          lines.forEach((line, i) => {
            if(line) {
              setTimeout(() => line.classList.add('typed'), i * 350);
            }
          });
          termObserver.unobserve(entries[0].target);
        }
      }, { threshold: 0.3 });
      termObserver.observe(termBody);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      {/* NAV */}
      <nav className="landing-nav">
        <Link to="/" className="landing-nav-logo">
          <div className="landing-nav-logo-icon">⚡</div>
          NexusAPI
        </Link>
        <ul className="landing-nav-links">
          <li><a href="#how">How it works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#docs">Docs</a></li>
        </ul>
        <Link to="/login" className="landing-nav-cta">Get Started →</Link>
      </nav>

      {/* HERO */}
      <section className="landing-hero">
        <div className="hero-grid"></div>
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>

        <div className="hero-badge">
          <div className="badge-dot"></div>
          Usage-Based API Billing Platform
        </div>

        <h1 className="hero-title">
          The API Gateway<br/>
          <span data-text="Built for Scale">Built for Scale</span>
        </h1>

        <p className="hero-sub">
          Meter every request. Rate limit with Redis. Bill automatically.
          The infrastructure layer that powers API-first companies.
        </p>

        <div className="hero-actions">
          <Link to="/register" className="landing-btn-primary">
            Start Building Free <span>→</span>
          </Link>
          <a href="#how" className="landing-btn-secondary">
            <span>▶</span> See how it works
          </a>
        </div>

        <div className="ticker-wrap">
          <div className="ticker" id="ticker"></div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how">
        <div className="flow-section">
          <div className="reveal">
            <div className="landing-section-label">Architecture</div>
            <h2 className="flow-title">Every request,<br/>tracked & metered</h2>
          </div>
          <div className="flow-steps">
            <div className="flow-step">
              <div className="flow-num">01</div>
              <h3>Register API</h3>
              <p>Connect your upstream API with a base URL. NexusAPI wraps it in a secure gateway.</p>
            </div>
            <div className="flow-step">
              <div className="flow-num">02</div>
              <h3>Generate Keys</h3>
              <p>Issue SHA-256 hashed API keys per user or team. Rotate and revoke in one click.</p>
            </div>
            <div className="flow-step">
              <div className="flow-num">03</div>
              <h3>Gateway Proxy</h3>
              <p>All requests flow through the gateway — validated, rate-limited, logged, then forwarded.</p>
            </div>
            <div className="flow-step">
              <div className="flow-num">04</div>
              <h3>Auto Bill</h3>
              <p>BullMQ cron jobs aggregate usage monthly. Razorpay invoices generated automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features">
        <div className="features-section">
          <div className="reveal" style={{ marginBottom: 40 }}>
            <div className="landing-section-label">Features</div>
            <h2 className="flow-title">Everything you need<br/>to monetize APIs</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>API Gateway</h3>
              <p>Intercepts every request, validates API keys, and proxies to your upstream in under 10ms overhead.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Rate Limiting</h3>
              <p>Redis sliding-window algorithm. Per-key, per-plan limits with real-time X-RateLimit headers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Real-time Analytics</h3>
              <p>Live request logs, hourly timeseries charts, latency percentiles, and error rate dashboards.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔑</div>
              <h3>Key Management</h3>
              <p>Generate, revoke, and rotate API keys. SHA-256 hashed at rest — never stored in plain text.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Billing Engine</h3>
              <p>Async jobs calculate usage, apply overage pricing, and trigger payment flows easily.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Webhooks</h3>
              <p>HMAC-signed webhook payloads notify your systems on limit hits, payments, and key events.</p>
            </div>
          </div>
        </div>
      </section>

      {/* GATEWAY DEMO */}
      <section>
        <div className="demo-section">
          <div className="demo-grid">
            <div className="demo-terminal">
              <div className="terminal-bar">
                <div className="t-dot" style={{background:'#ef4444'}}></div>
                <div className="t-dot" style={{background:'#f59e0b'}}></div>
                <div className="t-dot" style={{background:'#22c55e'}}></div>
                <span className="t-label">gateway · live</span>
              </div>
              <div className="terminal-body" id="terminalBody">
                <div className="t-line" id="tl1">
                  <span style={{color:'var(--primary)'}}>$</span>
                  <span style={{color:'var(--text-1)', marginLeft:8}}>curl localhost:5000/gateway/nx_live_8f3a.../pokemon/pikachu</span>
                </div>
                <div className="t-line" id="tl2">
                  <span style={{color:'var(--text-3)'}}># ✓ Key validated (SHA-256 lookup)</span>
                </div>
                <div className="t-line" id="tl3">
                  <span style={{color:'var(--text-3)'}}># ✓ Rate limit: 6/10 req/min (Redis)</span>
                </div>
                <div className="t-line" id="tl4">
                  <span style={{color:'var(--text-3)'}}># ✓ Log saved async (MongoDB)</span>
                </div>
                <div className="t-line" id="tl5">
                  <span style={{color:'var(--text-3)'}}># ✓ Proxied → pokeapi.co/api/v2</span>
                </div>
                <div className="t-line" id="tl6" style={{marginTop: 8}}>
                  <span style={{color:'var(--success)'}}>HTTP 200</span>
                  <span style={{color:'#3b82f6', margin:'0 8px'}}>94ms</span>
                  <span style={{color:'var(--primary-light)'}}>X-Gateway: NexusAPI</span>
                </div>
                <div className="t-line" id="tl7">
                  <span style={{color:'var(--primary-light)'}}>"name":</span>
                  <span style={{color:'var(--success)', margin:'0 8px'}}>"pikachu"</span>
                  <span style={{color:'var(--text-3)'}}>{/* response forwarded */}</span>
                </div>
              </div>
            </div>

            <div className="demo-text">
              <div className="landing-section-label">Gateway Layer</div>
              <h2>One proxy.<br/>Infinite control.</h2>
              <p>Every API call flows through NexusAPI's gateway — your killer feature that makes this project elite.</p>

              <div style={{display:'flex', flexDirection:'column', gap:8, marginTop:28}}>
                <div className="chain-item">
                  <div className="chain-icon" style={{background:'rgba(239,68,68,0.1)'}}>🔐</div>
                  Validate API key (hash lookup)
                </div>
                <div className="chain-item">
                  <div className="chain-icon" style={{background:'rgba(245,158,11,0.1)'}}>⏱️</div>
                  Apply rate limit (Redis sliding window)
                </div>
                <div className="chain-item">
                  <div className="chain-icon" style={{background:'rgba(59,130,246,0.1)'}}>📝</div>
                  Log request async (non-blocking)
                </div>
                <div className="chain-item">
                  <div className="chain-icon" style={{background:'rgba(34,197,94,0.1)'}}>🚀</div>
                  Forward to upstream API
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing">
        <div className="pricing-section">
          <div className="reveal">
            <div className="landing-section-label">Pricing</div>
            <h2 className="flow-title">Pay for what you use</h2>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-plan">Free</div>
              <div className="pricing-price">₹0</div>
              <div className="pricing-per">forever</div>
              <div className="pricing-req">1,000 req / month</div>
              <div style={{height:1, background:'var(--border)', margin:'20px 0'}}></div>
              <div style={{fontSize:13, color:'var(--text-2)', marginBottom:10}}><span style={{color:'var(--success)', marginRight:8}}>✓</span> 1 API key</div>
              <div style={{fontSize:13, color:'var(--text-2)', marginBottom:10}}><span style={{color:'var(--success)', marginRight:8}}>✓</span> Basic analytics</div>
              <div style={{fontSize:13, color:'var(--text-2)', marginBottom:10}}><span style={{color:'var(--success)', marginRight:8}}>✓</span> 10 req / min rate limit</div>
              <Link to="/register" className="landing-btn-secondary" style={{width:'100%', justifyContent:'center', marginTop:28}}>Get started free</Link>
            </div>

            <div className="pricing-card featured">
              <div className="pricing-plan">Pro</div>
              <div className="pricing-price">₹1,499</div>
              <div className="pricing-per">per month</div>
              <div className="pricing-req">200,000 req / month</div>
              <div style={{height:1, background:'var(--border)', margin:'20px 0'}}></div>
              <div style={{fontSize:13, color:'var(--text-2)', marginBottom:10}}><span style={{color:'var(--success)', marginRight:8}}>✓</span> Unlimited API keys</div>
              <div style={{fontSize:13, color:'var(--text-2)', marginBottom:10}}><span style={{color:'var(--success)', marginRight:8}}>✓</span> Real-time analytics</div>
              <div style={{fontSize:13, color:'var(--text-2)', marginBottom:10}}><span style={{color:'var(--success)', marginRight:8}}>✓</span> 300 req / min rate limit</div>
              <Link to="/register" className="landing-btn-primary" style={{width:'100%', justifyContent:'center', marginTop:28}}>Start Pro →</Link>
            </div>

            <div className="pricing-card">
              <div className="pricing-plan">Enterprise</div>
              <div className="pricing-price">Custom</div>
              <div className="pricing-per">contact us</div>
              <div className="pricing-req">Unlimited requests</div>
              <div style={{height:1, background:'var(--border)', margin:'20px 0'}}></div>
              <div style={{fontSize:13, color:'var(--text-2)', marginBottom:10}}><span style={{color:'var(--success)', marginRight:8}}>✓</span> Custom rate limits</div>
              <div style={{fontSize:13, color:'var(--text-2)', marginBottom:10}}><span style={{color:'var(--success)', marginRight:8}}>✓</span> SLA guarantee</div>
              <div style={{fontSize:13, color:'var(--text-2)', marginBottom:10}}><span style={{color:'var(--success)', marginRight:8}}>✓</span> Dedicated support</div>
              <Link to="/register" className="landing-btn-secondary" style={{width:'100%', justifyContent:'center', marginTop:28}}>Talk to us →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to meter<br/><span style={{color:'var(--primary)'}}>every request?</span></h2>
        <p>Join developers building on NexusAPI — the gateway that scales with you.</p>
        <div className="cta-actions">
          <Link to="/register" className="landing-btn-primary">Create Free Account →</Link>
          <Link to="/login" className="landing-btn-secondary">View Dashboard</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-nav-logo">
          <div className="landing-nav-logo-icon" style={{width:24, height:24, fontSize:12}}>⚡</div>
          NexusAPI
        </div>
        <div style={{display:'flex', gap:24}}>
          <Link to="/" style={{fontSize:12, color:'var(--text-3)', textDecoration:'none'}}>Docs</Link>
          <Link to="/" style={{fontSize:12, color:'var(--text-3)', textDecoration:'none'}}>GitHub</Link>
          <Link to="/" style={{fontSize:12, color:'var(--text-3)', textDecoration:'none'}}>Privacy</Link>
        </div>
        <div style={{fontSize:12, color:'var(--text-3)', fontFamily:'DM Mono, monospace'}}>
          © 2026 NexusAPI. Built with MERN + Redis.
        </div>
      </footer>
    </div>
  );
}
