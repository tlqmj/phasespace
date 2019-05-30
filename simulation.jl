function step_sim!(θ, p_θ, dt)
    p_θ[] = p_θ[] - 9.8*sin(θ[])*dt
    θ[]   = θ[]   + p_θ[]*dt

    if (θ[] > π)
        θ[] = θ[] - 2*π
    elseif (θ[] < -π)
        θ[] = θ[] + 2*π
    end
end

function advance_sim!(θ, p_θ, dt, Δt)

  Δt_partial = zero(dt)

  while Δt_partial <= Δt
    step_sim!(θ, p_θ, dt)
    Δt_partial += dt
  end

  return Δt_partial - Δt
end

function sim!(θ, p_θ; dt=1/24/4, fps = 24, scene)

    frame_duration = 1/fps
    t_overshoot = zero(dt)
    limiter = Limiter(frame_duration)

    while scene.events.window_open[]
        t_overshoot = advance_sim!(θ, p_θ, dt, frame_duration - t_overshoot)
        limiter()
    end
end
