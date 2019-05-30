mutable struct Limiter
  Δt::Float64
  t₀::Float64
end

function Limiter(Δt::Number)
  return Limiter(Float64(Δt), time())
end

function (lim::Limiter)()
  t = time()
  diff = lim.Δt - (t - lim.t₀)

  if diff > 0.0
    sleep(diff)
  else
    yield()
  end

  lim.t₀ = t
end
